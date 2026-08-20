import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { Recipe, RecipesListConfig } from '../models/recipe.model';

export function withPagination() {
  return signalStoreFeature(
    withState<PaginationState>({
      _hasMoreRecipes: false,
      _recipeListConfig: {
        page: 1,
        limit: 10,
        pageLastElements: new Map<number, Recipe>(),
      },
    }),
    withComputed((store) => ({
      paginator: computed(() => {
        const hasMore = store._hasMoreRecipes();
        const hasPrevious = store._recipeListConfig.page() > 1;
        return {
          show: hasPrevious || hasMore,
          hasPreviousPage: hasPrevious,
          hasNextPage: hasMore,
        };
      }),
    })),
    withMethods((store) => ({
      goToNextPage(recipes: Recipe[] | null | undefined) {
        patchState(store, goToNextPage(recipes ?? []));
      },
      goToPrevPage() {
        patchState(store, goToPrevPage());
      },
    })),
  );
}

interface PaginationState {
  _hasMoreRecipes: boolean;
  _recipeListConfig: RecipesListConfig;
}

function goToNextPage(recipes: Recipe[]) {
  return (state: PaginationState) => {
    const currentConfig = state._recipeListConfig;
    //const recipes = store.recipes();
    if (recipes && recipes.length > 0) {
      const newPageLastElements = new Map(currentConfig.pageLastElements);
      newPageLastElements.set(currentConfig.page, recipes[recipes.length - 1]);
      return {
        _recipeListConfig: {
          ...currentConfig,
          page: currentConfig.page + 1,
          pageLastElements: newPageLastElements,
        },
      };
    }
    return {
      ...state,
    };
  };
}

function goToPrevPage() {
  return (state: PaginationState) => {
    const currentConfig = state._recipeListConfig;
    if (currentConfig.page > 1) {
      return {
        ...state,
        _recipeListConfig: { ...currentConfig, page: currentConfig.page - 1 },
      };
    }
    return {
      ...state,
    };
  };
}
