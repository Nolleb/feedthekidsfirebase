import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withProps,
  withState,
  withFeature,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { RecipeService } from '../../../services/recipes.service';
import { updateRecipes } from './favorites.updaters';
import { UserService } from '../../../services/user.service';
import { InitialFavoritesSlice } from './favorites.slice';
import { withRecipeSync } from '../../../shared/utils/sync-recipes-with-enrichments';
import { withCategories } from '../../../signal-store-feature/with-categories';
import { withUser } from '../../../signal-store-feature/with-user';

// Create the SignalStore
export const FavoritesStore = signalStore(
  withState(InitialFavoritesSlice),
  withCategories(),
  withUser(),
  withProps(() => ({
    _recipesService: inject(RecipeService),
    _userService: inject(UserService),
  })),

  withProps((store) => ({
    _favoriteList: store._recipesService.getRecipesByIdsResource(store.userIDs, 10),
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

  withHooks({
    onInit(store) {
      effect(() => {
        const userId = store.userID();

        if (!userId) {
          patchState(store, { userIDs: [] });
          return;
        }

        store._userService.getUserFavorites(userId).subscribe((favorites) => {
          patchState(store, { userIDs: favorites });
        });
      });
    },
  }),

  withFeature((store) =>
    withRecipeSync(store._favoriteList, store.categories, store.userIDs, updateRecipes),
  ),

  withDevtools('FavoritesStore'),
);
