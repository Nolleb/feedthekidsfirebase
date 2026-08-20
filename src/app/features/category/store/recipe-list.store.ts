import {signalStore, withFeature, withState,} from '@ngrx/signals';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import {InitialRecipeListSlice} from './recipe-list.slice';
import {withCategories} from '../../../signal-store-feature/with-categories';
import {withUser} from '../../../signal-store-feature/with-user';
import {getUserFavouriteIds, withUserFavouritesIds} from '../../../signal-store-feature/with-user-favorites-ids';
import {withCategorizedRecipes} from '../../../signal-store-feature/with-categorized-recipes';
import {withPagination} from '../../../signal-store-feature/with-pagination';

// Create the SignalStore
export const RecipeListStore = signalStore(
  withState(InitialRecipeListSlice),
  withCategories(),
  withUser(),
  withPagination(),
  withFeature(({ userID }) =>
    withUserFavouritesIds(() => ({
      userID: userID() || '',
    })),
  ),

  withFeature((store) =>
    withCategorizedRecipes(() => ({
      categories: store.categories() || [],
      userFavorites: getUserFavouriteIds(store)() || [],
      recipeListConfig: store._recipeListConfig()
    })),
  ),
  //sortir le reste dans un withPagination + les actions à part goToNextPage / goToPrevPage


/*  withComputed((store) => ({
    paginator: computed(() => {
      const hasMore = store.hasMoreRecipes();
      const hasPrevious = store.recipeListConfig.page() > 1;
      return {
        show: hasPrevious || hasMore,
        hasPreviousPage: hasPrevious,
        hasNextPage: hasMore,
      };
    }),
  })),*/
/*

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
            pageLastElements: newPageLastElements,
          },
        });
      }
    },
    goToPrevPage() {
      const currentConfig = store.recipeListConfig();
      if (currentConfig.page > 1) {
        patchState(store, {
          recipeListConfig: { ...currentConfig, page: currentConfig.page - 1 },
        });
      }
    },
  })),

  withComputed((store) => {
    const categoryID = computed(() => {
      const categories = store.categories();
      const slug = store.slug();
      if (!categories || !slug) return null;
      const category = categories.find((c) => c.slug === slug);
      return category?.id ?? null;
    });

    return { categoryID };
  }),

  withProps((store) => ({
    _recipeList: store._recipesService.getRecipeResourceBySlug(
      store.categoryID,
      store.recipeListConfig,
    ),
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
*/

/*
  withHooks({
    onInit(store) {
      effect(() => {
        const res = store._recipeList;

        if (!res.hasValue()) return;

        const data = res.value();
        if (!data) return;

        const { recipes: recipesDto, hasMore } = data;

        const categories = store.categories();
        if (!categories) return;

        const userId = store.userID();

        if (!userId) {
          patchState(store, updateRecipes(recipesDto, categories, []), { hasMoreRecipes: hasMore });
          return;
        }

        store._userService.getUserFavorites(userId).subscribe((favorites) => {
          patchState(store, updateRecipes(recipesDto, categories, favorites), {
            hasMoreRecipes: hasMore,
          });
        });
      });
    },
  }),
*/

  withDevtools('RecipeListStore'),
);
