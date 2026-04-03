import { signalStore, patchState, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { withDevtools, withLocalStorage, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { AssistantService } from '../../../services/assistant.service';
import { InitialAssistantSlice } from './assistant.slice';
import { setLoading, setGeneratedRecipes, setError } from './assistant.updater';
import { AssistedRecipe } from '../../../models/recipe.model';
import { v4 as uuidv4 } from 'uuid';

export const AssistantStore = signalStore(
  { providedIn: 'root' },
  withState(InitialAssistantSlice),

  withProps(() => ({
    _assistantService: inject(AssistantService),
  })),

  withComputed((store) => ({
    hasRecipes: computed(() => store.generatedRecipes().length > 0),
    isLoading: computed(() => store.loading()),
    hasError: computed(() => !!store.error()),
  })),

  withMethods((store) => ({
    generateRecipes(ingredients: string[]) {
      patchState(store, setLoading());

      store._assistantService.generateRecipes(ingredients).subscribe({
        next: (response) => {
          if ('error' in response && typeof response.error === 'string') {
            patchState(store, setError(response.error));
          } else {
            const recipes = (response as AssistedRecipe[]).map(r => ({
              ...r,
              id: r.id || uuidv4(),
            }));
            patchState(store, setGeneratedRecipes(recipes));
          }
        },
        error: (err) => {
          const message = err?.message || 'Une erreur est survenue lors de la génération des recettes.';
          patchState(store, setError(message));
        },
      });
    },

    clearRecipes() {
      patchState(store, setGeneratedRecipes([]));
      localStorage.removeItem('assistantStore');
    },

    clearError() {
      patchState(store, setError(''));
    },
  })),

  withStorageSync(
    {
      key: 'assistantStore',
      select: ({ generatedRecipes }) => ({ generatedRecipes }),
    },
    withLocalStorage()
  ),

  withDevtools('AssistantStore')
);
