import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withProps,
  withState,
} from '@ngrx/signals';
import { RecipeService } from '../services/recipes.service';
import { computed, effect, inject } from '@angular/core';
import { Category } from '../models/category.model';
import { Recipe } from '../models/recipe.model';
import { mapRecipesDtoToRecipes } from '../mappers/map-recipes-dto-to-recipes';

export function withLastRecipes(
  trackingSignal: () => {
    categories: Category[];
    userFavorites: string[];
    recipesNb: number;
  },
) {
  return signalStoreFeature(
    withState({ lastRecipesUpdated: null as Recipe[] | null }),
    withProps(() => ({
      _recipesService: inject(RecipeService),
    })),
    withProps((store) => ({
      _lastDtoRecipes: store._recipesService.getLatestRecipesResource(trackingSignal().recipesNb),
    })),
    withComputed((store) => {
      const lastRecipesLoading = computed(() => store._lastDtoRecipes.isLoading());
      const lastRecipesError = computed(() => store._lastDtoRecipes.error());
      const lastRecipesHasError = computed(() => !!lastRecipesError());

      return {
        lastRecipesLoading,
        lastRecipesError,
        lastRecipesHasError,
      };
    }),
    withHooks((store) => ({
      onInit() {
        effect(() => {
          const { categories, userFavorites } = trackingSignal();

          patchState(store, {
            lastRecipesUpdated:
              mapRecipesDtoToRecipes(
                store._lastDtoRecipes.value() ?? [],
                categories,
                userFavorites,
              ) ?? [],
          });
        });
      },
    })),
  );
}
