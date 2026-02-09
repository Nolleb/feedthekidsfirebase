import {
    patchState,
    signalStore,
    watchState,
    withComputed,
    withHooks,
    withProps,
    withState,
    withFeature
} from '@ngrx/signals';
import {computed, effect, inject} from '@angular/core';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import { RecipeService } from '../../../services/recipes.service';
import { GlobalStore } from '../../../stores/global/global.store';
import { updateRecipes } from './favorites.updaters';
import { UserService } from '../../../services/user.service';
import { AuthStore } from '../../../stores/auth/auth.store';
import { InitialFavoritesSlice } from './favorites.slice';
import { withRecipeSync } from '../../../shared/utils/sync-recipes-with-enrichments';

// Create the SignalStore
export const FavoritesStore = signalStore(
  withState(InitialFavoritesSlice),
  withProps(() => ({
    _recipesService: inject(RecipeService),
    _globalStore: inject(GlobalStore),
    _userService: inject(UserService),
    _authStore: inject(AuthStore),
  })),

  withProps((store) => ({
    _favoriteList: store._recipesService.getRecipesByIdsResource(store.userIDs, 10),
  })),

  withComputed((store) => {
    const favoritesLoading = computed(() => store._favoriteList.isLoading());
    const error = computed(() => store._favoriteList.error());
    const hasError = computed(() => !!error());
    const favoritesNb = computed(() => store._favoriteList.hasValue() ? store._favoriteList.value().length : 0);

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
        const userId = store._authStore.getUserId();
        
        if (!userId) {
          patchState(store, { userIDs: [] });
          return;
        }

        store._userService.getUserFavorites(userId).subscribe(favorites => {
          patchState(store, { userIDs: favorites });
        });
      });
    },
  }),

  withFeature((store) => 
    withRecipeSync(
      store._favoriteList,
      store._globalStore.categories,
      store.userIDs,
      updateRecipes
    )
  ),

  withDevtools('FavoritesStore')
);
