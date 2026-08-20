import { signalStore, withFeature, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { InitialHomeSlice } from './home.slice';
import { withCategories } from '../../../signal-store-feature/with-categories';
import { withUser } from '../../../signal-store-feature/with-user';
import { withLastRecipes } from '../../../signal-store-feature/with-last-recipes';
import {getUserFavouriteIds, withUserFavouritesIds} from '../../../signal-store-feature/with-user-favorites-ids';
import { withSearchedRecipes } from '../../../signal-store-feature/with-searched-recipes';

// Create the SignalStore
export const HomeStore = signalStore(
  withState(InitialHomeSlice),
  withCategories(),
  withUser(),
  withFeature(({ userID }) =>
    withUserFavouritesIds(() => ({
      userID: userID() || '',
    })),
  ),
  withFeature((store) =>
    withLastRecipes(() => ({
      categories: store.categories() || [],
      userFavorites: getUserFavouriteIds(store)() || [],
      recipesNb: store.recipeNB() || 0,
    })),
  ),

  withFeature((store) =>
    withSearchedRecipes(() => ({
      categories: store.categories || [],
      userFavorites: getUserFavouriteIds(store)() || [],
    })),
  ),

  withDevtools('HomeStore'),
);
