import {signalStore, withFeature,} from '@ngrx/signals';
import {withDevtools} from '@angular-architects/ngrx-toolkit';
import {withCategories} from '../../../signal-store-feature/with-categories';
import {withUser} from '../../../signal-store-feature/with-user';
import {getUserFavouriteIds, withUserFavouritesIds} from '../../../signal-store-feature/with-user-favorites-ids';
import {withFavoritesRecipes} from '../../../signal-store-feature/with-favorites-recipes';

export const FavoritesStore = signalStore(
  withCategories(),
  withUser(),
  withFeature(({ userID }) =>
    withUserFavouritesIds(() => ({
      userID: userID() || '',
    })),
  ),

  withFeature(( store ) =>
    withFavoritesRecipes(() => ({
      userIds: getUserFavouriteIds(store)() || [],
      categories: store.categories() || [],
    })),
  ),

  withDevtools('FavoritesStore'),
);
