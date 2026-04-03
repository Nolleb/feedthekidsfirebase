import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { effect, inject } from '@angular/core';
import { InitialDetailAssistantSlice } from './detail-assistant.slice';
import { AssistantStore } from '../../store/assistant.store';
import { updateRecipeByID } from './detail-assistant.updater';

export const DetailAssistantStore = signalStore(
  withState(InitialDetailAssistantSlice),

  withProps(() => ({
    _assistantRecipes: inject(AssistantStore),
  })),

  withMethods((store) => ({
    setSelectedRecipeId(id: string) {
      patchState(store, {
        selectedRecipeId: id,
      });
    }
  })),

  withHooks({
    onInit(store) {
      effect(() => {
        const id = store.selectedRecipeId();
        const recipes = store._assistantRecipes.generatedRecipes();
        
        if(!id || !recipes) return;
        patchState(store, updateRecipeByID(recipes, id));
      });
    }
  }),

  withDevtools('DetailAssistantStore')
);
