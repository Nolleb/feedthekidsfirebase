import { AssistedRecipe } from "../../../../models/recipe.model";

export interface DetailAssistantSlice {
  assistantRecipe: AssistedRecipe | null;
  selectedRecipeId: string | null;
}

export const InitialDetailAssistantSlice: DetailAssistantSlice = {
  assistantRecipe: null,
  selectedRecipeId: null,
};
