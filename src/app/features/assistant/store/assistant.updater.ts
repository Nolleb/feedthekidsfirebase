import { PartialStateUpdater } from '@ngrx/signals';
import { AssistantSlice } from './assistant.slice';
import { AssistedRecipe } from '../../../models/recipe.model';

export function setLoading(): PartialStateUpdater<AssistantSlice> {
  return () => ({
    loading: true,
    error: null,
  });
}

export function setGeneratedRecipes(recipes: AssistedRecipe[]): PartialStateUpdater<AssistantSlice> {
  return () => ({
    generatedRecipes: recipes,
    loading: false,
    error: null,
  });
}

export function setError(error: string): PartialStateUpdater<AssistantSlice> {
  return () => ({
    loading: false,
    error,
  });
}
