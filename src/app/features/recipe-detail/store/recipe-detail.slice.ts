import { Recipe } from "../../../models/recipe.model";

export interface RecipeDetailSlice {
  recipe: Recipe | null;
  id: string | null;
}

export const InitialRecipeDetailSlice: RecipeDetailSlice = {
  recipe: null,
  id: null,
};