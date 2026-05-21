import {
  patchState,
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  setEntities,
  withEntities,
  addEntity,
  updateEntity,
  removeAllEntities,
} from '@ngrx/signals/entities';
import { RecipeService } from '../../../services/recipes.service';
import { GlobalStore } from '../../../stores/global/global.store';
import { Recipe } from '../../../models/recipe.model';
import { mapRecipesDtoToRecipes } from '../../../mappers/map-recipes-dto-to-recipes';
import { AdminRecipeSlice, InitialAdminRecipeSlice } from './admin-recipe.slice';
import { mapRecipeToRecipeDto } from '../../../mappers/map-recipe-to-recipe-dto';
import { Router } from '@angular/router';

// Create the SignalStore
export const AdminRecipeStore = signalStore(
  { providedIn: 'root' },

  withState<AdminRecipeSlice>(InitialAdminRecipeSlice),
  withEntities<Recipe>(),

  withProps(() => ({
    _recipesService: inject(RecipeService),
  })),

  withProps((store) => ({
    _recipes: store._recipesService.getAdminRecipesResource(store.recipeListConfig),
    _globalStore: inject(GlobalStore),
    _router: inject(Router),
    _selectedRecipe: store._recipesService.getRecipeResourceById(store.selectedRecipeId),
  })),

  // Add computed values (like selectors)
  withComputed((store) => {
    const recipesLoading = computed(() => store._recipes.isLoading());
    const error = computed(() => store._recipes.error());
    const hasError = computed(() => !!error());

    const selectedRecipeDto = computed(() => store._selectedRecipe.value());
    const selectedRecipeLoading = computed(() => store._selectedRecipe.isLoading());

    const selectedRecipe = computed(() => {
      const recipeDto = selectedRecipeDto();
      if (!recipeDto) return null;

      const categories = store._globalStore.categories();

      if (!categories) return null;

      return mapRecipesDtoToRecipes([recipeDto], categories, [])[0] ?? null;
    });

    const paginator = computed(() => ({
      show: store.hasMoreRecipes() || store.recipeListConfig.page() > 1,
      hasPreviousPage: store.recipeListConfig.page() > 1,
      hasNextPage: store.hasMoreRecipes(),
    }));

    return {
      recipesLoading,
      error,
      hasError,
      selectedRecipe,
      selectedRecipeLoading,
      paginator,
    };
  }),

  // Add methods (like actions)
  withMethods((store) => ({
    getRecipeById(id: string): Recipe | null {
      const entities = store.entities();
      return entities.find((recipe) => recipe.id === id) ?? null;
    },

    saveRecipe(recipe: Recipe) {
      const recipeDto = mapRecipeToRecipeDto(recipe);

      if (recipe.id) {
        // Update existing recipe
        store._recipesService.updateRecipeResource(recipe.id, recipeDto).subscribe(() => {
          patchState(store, updateEntity({ id: recipe.id!, changes: recipe }));
        });
      } else {
        // Create new recipe
        store._recipesService.createNewRecipeResource(recipeDto).subscribe((generatedId) => {
          const recipeWithId = { ...recipe, id: generatedId };
          patchState(store, addEntity(recipeWithId));
          store._router.navigate(['admin-recipes']);
        });
      }
    },

    reloadRecipes() {
      return store._recipes.reload();
    },

    goToNextPage() {
      const currentConfig = store.recipeListConfig();
      const entities = store.entities();
      if (entities.length > 0) {
        const newPageLastElements = new Map(currentConfig.pageLastElements);
        newPageLastElements.set(currentConfig.page, entities[entities.length - 1]);
        patchState(store, {
          recipeListConfig: {
            ...currentConfig,
            page: currentConfig.page + 1,
            pageLastElements: newPageLastElements,
          },
        });
      }
    },

    goToPrevPage() {
      const currentConfig = store.recipeListConfig();
      if (currentConfig.page > 1) {
        patchState(store, {
          recipeListConfig: { ...currentConfig, page: currentConfig.page - 1 },
        });
      }
    },

    setSelectedRecipeId(id: string) {
      patchState(store, { selectedRecipeId: id });
    },

    reloadSelectedRecipe() {
      return store._selectedRecipe.reload();
    },
  })),

  withHooks({
    onInit(store) {
      effect(() => {
        const res = store._recipes;

        if (!res.hasValue()) return;

        const categories = store._globalStore.categories();

        if (!categories) return;

        const { recipes: recipesDto, hasMore } = res.value()!;
        const allRecipes = mapRecipesDtoToRecipes(recipesDto, categories, []);
        patchState(store, removeAllEntities(), setEntities(allRecipes), {
          hasMoreRecipes: hasMore,
        });
      });
    },
  }),

  withDevtools('RecipeStore'),
);
