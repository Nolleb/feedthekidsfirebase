import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { AuthStore } from '../stores/auth/auth.store';

export function withUser() {
  return signalStoreFeature(
    withState({ _userCacheID: null as string | null }),
    withProps(() => ({
      _authStore: inject(AuthStore),
    })),

    withComputed((store) => {
      const userID = computed(() => store._userCacheID() ?? store._authStore.getUserId());
      const isAuthenticated = computed(() => store._authStore.isAuthenticated());

      return {
        userID,
        isAuthenticated,
      };
    }),

    withHooks((store) => ({
      onInit() {
        // Charger le cache au démarrage
        const cached = localStorage.getItem('user');
        if (cached) patchState(store, { _userCacheID: JSON.parse(cached) });

        // Sauvegarder quand la resource Firestore répond
        effect(() => {
          const val = store.userID();
          if (val) {
            patchState(store, { _userCacheID: val });
            localStorage.setItem('user', JSON.stringify(val));
          }
        });
      },
    })),
  );
}
