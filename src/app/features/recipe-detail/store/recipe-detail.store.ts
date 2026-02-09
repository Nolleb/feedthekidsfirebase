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
import {computed, effect, inject} from '@angular/core';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import { RecipeService } from '../../../services/recipes.service';
import { GlobalStore } from '../../../stores/global/global.store';
import { InitialRecipeDetailSlice } from './recipe-detail.slice';
import { updateRecipe } from './recipe-detail.updaters';
import { UserService } from '../../../services/user.service';
import { AuthStore } from '../../../stores/auth/auth.store';

// Create the SignalStore
export const RecipeDetailStore = signalStore(
  withState(InitialRecipeDetailSlice),
  withProps(() => ({
    _recipesService: inject(RecipeService),
    _globalStore: inject(GlobalStore),
    _userService: inject(UserService),
    _authStore: inject(AuthStore),
  })),

  withMethods((store) => ({
    setRecipeId(recipeId: string) {
      patchState(store, { id: recipeId });
    }
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

  withHooks({
    onInit(store) {
      effect(() => {
        const res = store._recipeDetail;

        if (!res.hasValue()) return;

        const recipe = res.value();

        const categories = store._globalStore.categories();

        if (!categories) return;

        const userId = store._authStore.getUserId();
        
        if (!userId) {
            patchState(store, updateRecipe(recipe, categories, []));
            return;
        }

        store._userService.getUserFavorites(userId).subscribe(favorites => {
            patchState(store, updateRecipe(recipe, categories, favorites));
        });
      });
    },
  }),

  withDevtools('RecipeDetailStore')
);
