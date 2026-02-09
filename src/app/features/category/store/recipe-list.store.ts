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
import { InitialRecipeListSlice } from './recipe-list.slice';
import { updateRecipes } from './recipe-list.updaters';
import { UserService } from '../../../services/user.service';
import { AuthStore } from '../../../stores/auth/auth.store';

// Create the SignalStore
export const RecipeListStore = signalStore(
  withState(InitialRecipeListSlice),
  withProps(() => ({
    _recipesService: inject(RecipeService),
    _globalStore: inject(GlobalStore),
    _userService: inject(UserService),
    _authStore: inject(AuthStore),
  })),

  withComputed(store => ({
    paginator: computed(() => {
      const hasMore = store.hasMoreRecipes();
      const hasPrevious = store.recipeListConfig.page() > 1;
      return {
        show: hasPrevious || hasMore,
        hasPreviousPage: hasPrevious,
        hasNextPage: hasMore,
      };
    }),
  })),

  withMethods((store) => ({
    setCategorySlug(categorySlug: string) {
      patchState(store, { slug: categorySlug });
    },
    goToNextPage() {
      const currentConfig = store.recipeListConfig();
      const recipes = store.recipes();
      if (recipes && recipes.length > 0) {
        const newPageLastElements = new Map(currentConfig.pageLastElements);
        newPageLastElements.set(currentConfig.page, recipes[recipes.length - 1]);
        patchState(store, { 
          recipeListConfig: { 
            ...currentConfig, 
            page: currentConfig.page + 1,
            pageLastElements: newPageLastElements 
          } 
        });
      }
    },
    goToPrevPage() {
      const currentConfig = store.recipeListConfig();
      if (currentConfig.page > 1) {
        patchState(store, { 
          recipeListConfig: { ...currentConfig, page: currentConfig.page - 1 } 
        });
      }
    },
  })),

  withComputed((store) => {
    const categoryID = computed(() => {
      const categories = store._globalStore.categories();
      const slug = store.slug();
      if (!categories || !slug) return null;
      const category = categories.find(c => c.slug === slug);
      return category?.id ?? null;
    });

    return { categoryID };
  }),

  withProps((store) => ({
    _recipeList: store._recipesService.getRecipeResourceBySlug(store.categoryID, store.recipeListConfig),
  })),

  withComputed((store) => {
    const recipesLoading = computed(() => store._recipeList.isLoading());
    const error = computed(() => store._recipeList.error());
    const hasError = computed(() => !!error());

    return {
        recipesLoading,
        error,
        hasError,
    };
  }),

  withHooks({
    onInit(store) {
      effect(() => {
        const res = store._recipeList;

        if (!res.hasValue()) return;

        const data = res.value();
        if (!data) return;

        const { recipes: recipesDto, hasMore } = data;

        const categories = store._globalStore.categories();
        if (!categories) return;

        const userId = store._authStore.getUserId();
        
        if (!userId) {
          patchState(
            store, 
            updateRecipes(recipesDto, categories, []),
            { hasMoreRecipes: hasMore }
          );
          return;
        }

        store._userService.getUserFavorites(userId).subscribe(favorites => {
          patchState(
            store, 
            updateRecipes(recipesDto, categories, favorites),
            { hasMoreRecipes: hasMore }
          );
        });
      });
    },
  }),

  withDevtools('RecipeListStore')
);
