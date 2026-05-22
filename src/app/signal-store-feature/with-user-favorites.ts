import { effect, inject } from '@angular/core';
import { patchState, signalStoreFeature, withHooks, withProps, withState } from '@ngrx/signals';
import { UserService } from '../services/user.service';

export function withUserFavourites(trackingSignal: () => { userID: string }) {
  return signalStoreFeature(
    withState({ userFavorites: [] as string[] }),
    withProps(() => ({
      _userService: inject(UserService),
    })),

    withHooks({
      onInit(store) {
        effect(() => {
          const userId = trackingSignal().userID;

          if (!userId) {
            patchState(store, { userFavorites: [] });
            return;
          }

          store._userService.getUserFavorites(userId).subscribe((favorites) => {
            patchState(store, { userFavorites: favorites });
          });
        });
      },
    }),
  );
}
