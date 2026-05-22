import { signalStore, withFeature } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withCategories } from '../../../signal-store-feature/with-categories';
import { withUser } from '../../../signal-store-feature/with-user';
import { withUserFavourites } from '../../../signal-store-feature/with-user-favorites';
import { withRecipeDetail } from '../../../signal-store-feature/with-recipe-detail';
// Create the SignalStore
export const RecipeDetailStore = signalStore(
  withCategories(),
  withUser(),
  withFeature(({ userID }) =>
    withUserFavourites(() => ({
      userID: userID() || '',
    })),
  ),

  withFeature(({ categories, userFavorites }) =>
    withRecipeDetail(() => ({
      categories: categories() || [],
      userFavorites: userFavorites() || [],
    })),
  ),

  withDevtools('RecipeDetailStore'),
);
