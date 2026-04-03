import { AssistedRecipe } from '../../../models/recipe.model';

export interface AssistantSlice {
  generatedRecipes: AssistedRecipe[];
  loading: boolean;
  error: string | null;
}

export const InitialAssistantSlice: AssistantSlice = {
  generatedRecipes: [],
  loading: false,
  error: null,
};
