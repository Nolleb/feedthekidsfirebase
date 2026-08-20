import {effect, inject, Signal} from '@angular/core';
import { patchState, signalStoreFeature, withHooks, withProps, withState } from '@ngrx/signals';
import { UserService } from '../services/user.service';

const FAVOURITE_IDS = Symbol('FAVOURITE_IDS');
export function withUserFavouritesIds(trackingSignal: () => { userID: string }) {
  return signalStoreFeature(
    withState({ [FAVOURITE_IDS]: [] as string[] }),
    withProps(() => ({
      _userService: inject(UserService),
    })),

    withHooks({
      onInit(store) {
        effect(() => {
          const userId = trackingSignal().userID;

          if (!userId) {
            patchState(store, { [FAVOURITE_IDS]: [] });
            return;
          }

          store._userService.getUserFavorites(userId).subscribe((favorites) => {
            patchState(store, { [FAVOURITE_IDS]: favorites });
          });
        });
      },
    }),
  );
}

export function getUserFavouriteIds(store: {[FAVOURITE_IDS]: Signal<string[]>}){
  return store[FAVOURITE_IDS]
}
