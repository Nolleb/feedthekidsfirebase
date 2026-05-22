import { inject, computed, effect } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { RecipeService } from '../services/recipes.service';
import { Recipe, RecipeDto } from '../models/recipe.model';
import { mapRecipesDtoToRecipes } from '../mappers/map-recipes-dto-to-recipes';
import { Category } from '../models/category.model';

export function withRecipeDetail(
  trackingSignal: () => {
    categories: Category[];
    userFavorites: string[];
  },
) {
  return signalStoreFeature(
    withState({
      id: '' as string,
      lastRecipeUpdated: null as Recipe | null,
    }),
    withProps(() => ({
      _recipesService: inject(RecipeService),
    })),

    withMethods((store) => ({
      setRecipeId(recipeId: string) {
        console.log('Setting recipe ID in store:', recipeId);
        patchState(store, { id: recipeId });
      },
    })),

    withProps((store) => ({
      _recipeDetail: store._recipesService.getRecipeResourceById(store.id),
    })),

    withComputed((store) => {
      const recipeLoading = computed(() => store._recipeDetail.isLoading());
      const error = computed(() => store._recipeDetail.error());
      const hasError = computed(() => !!error());

      return {
        recipeLoading,
        error,
        hasError,
      };
    }),
    withHooks((store) => ({
      onInit() {
        effect(() => {
          const { categories, userFavorites } = trackingSignal();

          patchState(store, {
            lastRecipeUpdated: store._recipeDetail.value()
              ? mapRecipesDtoToRecipes(
                  [store._recipeDetail.value() as RecipeDto],
                  categories,
                  userFavorites,
                )[0]
              : null,
          });
        });
      },
    })),
  );
}
