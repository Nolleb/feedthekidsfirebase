import { signalStore, withFeature } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withCategories } from '../../../signal-store-feature/with-categories';
import { withUser } from '../../../signal-store-feature/with-user';
import {getUserFavouriteIds, withUserFavouritesIds} from '../../../signal-store-feature/with-user-favorites-ids';
import { withRecipeDetail } from '../../../signal-store-feature/with-recipe-detail';
// Create the SignalStore
export const RecipeDetailStore = signalStore(
  withCategories(),
  withUser(),
  withFeature(({ userID }) =>
    withUserFavouritesIds(() => ({
      userID: userID() || '',
    })),
  ),

  withFeature((store) =>
    withRecipeDetail(() => ({
      categories: store.categories() || [],
      userFavorites: getUserFavouriteIds(store)() || [],
    })),
  ),

  withDevtools('RecipeDetailStore'),
);
