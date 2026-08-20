import {patchState, signalStoreFeature, withComputed, withHooks, withProps, withState} from '@ngrx/signals';
import {computed, effect, inject} from '@angular/core';
import {RecipeService} from '../services/recipes.service';
import {mapRecipesDtoToRecipes} from '../mappers/map-recipes-dto-to-recipes';
import {Recipe} from '../models/recipe.model';
import {Category} from '../models/category.model';

export function withFavoritesRecipes(trackingSignal:() => {userIds: string[], categories: Category[]}) {
  return signalStoreFeature(
    withState({ favoritesRecipes: [] as Recipe[] }),
    withProps(() => ({
      _recipesService: inject(RecipeService),
    })),
    withProps((store) => ({
      _favoriteList: store._recipesService.getRecipesByIdsResource(computed(()=>trackingSignal().userIds),
        10),
    })),

    withComputed((store) => {
      const favoritesLoading = computed(() => store._favoriteList.isLoading());
      const error = computed(() => store._favoriteList.error());
      const hasError = computed(() => !!error());
      const favoritesNb = computed(() =>
        store._favoriteList.hasValue() ? store._favoriteList.value().length : 0,
      );

      return {
        favoritesLoading,
        error,
        hasError,
        favoritesNb,
      };
    }),
    withHooks((store) => ({
      onInit() {
        effect(() => {
          const { categories, userIds } = trackingSignal();

          patchState(store, {
            favoritesRecipes:  mapRecipesDtoToRecipes(
              store._favoriteList.value() ?? [],
              categories ?? [],
              userIds,
            ) ?? [],
          });
        });
      },
    })),
  )
}
