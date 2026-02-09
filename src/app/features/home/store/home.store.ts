import {
    patchState,
    signalStore,
    withComputed,
    withFeature,
    withHooks,
    withMethods,
    withProps,
    withState,
} from '@ngrx/signals';
import {computed, effect, inject} from '@angular/core';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import { RecipeService } from '../../../services/recipes.service';
import { GlobalStore } from '../../../stores/global/global.store';
import { UserService } from '../../../services/user.service';
import { AuthStore } from '../../../stores/auth/auth.store';
import { InitialHomeSlice } from './home.slice';
import { updateLastRecipes, updateSearchedRecipes } from './home.updaters';
import { withRecipeSync } from '../../../shared/utils/sync-recipes-with-enrichments';

// Create the SignalStore
export const HomeStore = signalStore(
  withState(InitialHomeSlice),
  withProps(() => ({
    _recipesService: inject(RecipeService),
    _globalStore: inject(GlobalStore),
    _userService: inject(UserService),
    _authStore: inject(AuthStore),
  })),

  withMethods((store) => ({
    setSearchTerm(term: string) {
      patchState(store, { searchTerm: term });
    }
  })),

  withProps((store) => ({
    _lastRecipes: store._recipesService.getLatestRecipesResource(3),
  })),

  withProps((store) => ({
    _seachedRecipes: store._recipesService.searchRecipesResource(store.searchTerm, store._globalStore.categories),
  })),

  withComputed((store) => {
    const lastRecipesLoading = computed(() => store._lastRecipes.isLoading());
    const error = computed(() => store._lastRecipes.error());
    const hasError = computed(() => !!error());
    const searchedRecipesLoading = computed(() => store._seachedRecipes.isLoading());
    const hasSearchTerm = computed(() => store.searchTerm().trim().length > 0);
    const hasSearchResults = computed(() => {
      const recipes = store.searchedRecipes();
      return recipes !== null && recipes.length > 0;
    });

    return {
      lastRecipesLoading,
      error,
      hasError,
      searchedRecipesLoading,
      hasSearchTerm,
      hasSearchResults
    };
  }),

  withHooks({
    onInit(store) {
      // Charger les favorites au démarrage
      effect(() => {
        const userId = store._authStore.getUserId();
        
        if (!userId) {
          patchState(store, { userFavorites: [] });
          return;
        }

        store._userService.getUserFavorites(userId).subscribe(favorites => {
          patchState(store, { userFavorites: favorites });
        });
      });
    },
  }),

  // Synchroniser lastRecipes avec enrichissements
  withFeature((store) => 
    withRecipeSync(
      store._lastRecipes,
      store._globalStore.categories,
      store.userFavorites,
      updateLastRecipes
    )
  ),

  // Synchroniser searchedRecipes avec enrichissements
  withFeature((store) => 
    withRecipeSync(
      store._seachedRecipes,
      store._globalStore.categories,
      store.userFavorites,
      updateSearchedRecipes
    )
  ),

  withDevtools('HomeStore')
);
