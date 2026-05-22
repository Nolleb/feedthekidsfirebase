import { signalStore, withFeature, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { InitialHomeSlice } from './home.slice';
import { withCategories } from '../../../signal-store-feature/with-categories';
import { withUser } from '../../../signal-store-feature/with-user';
import { withLastRecipes } from '../../../signal-store-feature/with-last-recipes';
import { withUserFavourites } from '../../../signal-store-feature/with-user-favorites';
import { withSearchedRecipes } from '../../../signal-store-feature/with-searched-recipes';

// Create the SignalStore
export const HomeStore = signalStore(
  withState(InitialHomeSlice),
  withCategories(),
  withUser(),
  withFeature(({ userID }) =>
    withUserFavourites(() => ({
      userID: userID() || '',
    })),
  ),
  withFeature(({ categories, userFavorites, recipeNB }) =>
    withLastRecipes(() => ({
      categories: categories() || [],
      userFavorites: userFavorites() || [],
      recipesNb: recipeNB() || 0,
    })),
  ),

  withFeature(({ categories, userFavorites }) =>
    withSearchedRecipes(() => ({
      categories: categories || [],
      userFavorites: userFavorites() || [],
    })),
  ),

  withDevtools('HomeStore'),
);
