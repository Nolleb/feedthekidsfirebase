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

  withDevtools('RecipeListStore'),
);
