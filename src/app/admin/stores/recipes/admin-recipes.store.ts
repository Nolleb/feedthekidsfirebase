import {patchState, signalStore, watchState, withComputed, withHooks, withMethods, withProps, withState} from '@ngrx/signals';
import {computed, effect, inject} from '@angular/core';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import {setEntities, withEntities, addEntity, updateEntity} from '@ngrx/signals/entities';
import {RecipeService} from '../../../services/recipes.service';
import {GlobalStore} from '../../../stores/global/global.store';
import {Recipe} from '../../../models/recipe.model';
import {mapRecipesDtoToRecipes} from '../../../mappers/map-recipes-dto-to-recipes';
import { AdminRecipeSlice, InitialAdminRecipeSlice } from './admin-recipe.slice';
import { mapRecipeToRecipeDto } from '../../../mappers/map-recipe-to-recipe-dto';
import { Router } from '@angular/router';

// Create the SignalStore
export const AdminRecipeStore = signalStore(
    {providedIn: 'root'},

    withState<AdminRecipeSlice>(InitialAdminRecipeSlice),
    withEntities<Recipe>(),

    withProps(() => ({
      _recipesService: inject(RecipeService),
    })),

    withProps((store) => ({
      _recipes: store._recipesService.recipesResource,
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

      return {
        recipesLoading,
        error,
        hasError,
        selectedRecipe,
        selectedRecipeLoading,
      };
    }),

    // Add methods (like actions)
    withMethods((store) => ({
      getRecipeById(id: string): Recipe | null {
        const entities = store.entities();
        return entities.find(recipe => recipe.id === id) ?? null;
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
            store._router.navigate([ 'admin-recipes']);
          });
        }
      },

      reloadRecipes() {
        return store._recipes.reload();
      },

      setSelectedRecipeId(id: string) {
        patchState(store, {selectedRecipeId: id});
      },
      
      reloadSelectedRecipe() {
        return store._selectedRecipe.reload();
      }

    })),

    withHooks({
      onInit(store) {
        effect(() => {
          const res = store._recipes;

          if (!res.hasValue()) return;

          const recipes = res.value()?.recipes ?? [];

          const categories = store._globalStore.categories();

          if (!categories) return;

          const allRecipes = mapRecipesDtoToRecipes(recipes, categories, [])
          patchState(store, setEntities(allRecipes));
        });
      },
    }),

    // Sync state to localStorage
 /*    withStorageSync(
        {
            key: 'currentUser',
            select: ({currentUser}) => ({currentUser}),
        },
        withLocalStorage()
    ), */

    withDevtools('RecipeStore')
);
