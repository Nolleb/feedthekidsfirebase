import {
    patchState,
    signalStore,
    watchState,
    withComputed,
    withHooks,
    withMethods,
    withProps,
    withState
} from '@ngrx/signals';
import {computed, effect, inject} from '@angular/core';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import { RecipeService } from '../../services/recipes.service';
import { InitialRecipeSlice } from './recipe.slice';
import { filterRecipeByID, filterRecipesByCategory, updateRecipes } from './recipe.updater';
import { Recipe, RecipeDto } from '../../models/recipe.model';
import { GlobalStore } from '../global/global.store';
import { UserService } from '../../services/user.service';
import { AuthStore } from '../auth/auth.store';

// Create the SignalStore
export const RecipeStore = signalStore(
    {providedIn: 'root'},

    // Add state
    withState(InitialRecipeSlice),

    withProps(() => ({
        _recipesService: inject(RecipeService),
        _globalStore: inject(GlobalStore),
        _userService: inject(UserService),
        _authStore: inject(AuthStore),
    })),

    withProps((store) => ({
        _recipes: store._recipesService.recipesResource,
        _recipeDetail: store._recipesService.getRecipeResourceById(store.recipeID),
    })),

    // Add computed values (like selectors)
    withComputed((store) => {
        const recipesLoading = computed(() => store._recipes.isLoading());
        const error = computed(() => store._recipes.error());
        const hasError = computed(() => !!error());

        return {
            recipesLoading,
            error,
            hasError
        };
    }),

    // Add methods (like actions)
    withMethods((store) => ({
      setRecipesByCategory(categorySlug: string) {
        patchState(store, filterRecipesByCategory(categorySlug))
      },

      setRecipeByID(id: string) {
        patchState(store, filterRecipeByID(id))
      },

      setRecipeID(id: string) {
        patchState(store, { recipeID: id })
      },

    })),

    withHooks({
        onInit(store) {
    
            effect(() => {
                const res = store._recipes;

                if (!res.hasValue()) return;

                const recipes = res.value()?.recipes ?? [];

                const categories = store._globalStore.categories();

                if (!categories) return;

                const userId = store._authStore.getUserId();
                
                if (!userId) {
                  patchState(store, updateRecipes(recipes, categories, []));
                  return;
                }

                store._userService.getUserFavorites(userId).subscribe(favorites => {
                  patchState(store, updateRecipes(recipes, categories, favorites));
                });
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
