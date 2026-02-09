import { Recipe } from "../../models/recipe.model";

export interface RecipeSlice {
  recipes: Recipe[] | null;
  filteredRecipes: Recipe[];
  recipeDetail: Recipe | null;
  recipeID: string | null;
}

export const InitialRecipeSlice: RecipeSlice = {
  recipes: null,
  filteredRecipes: [],
  recipeDetail: null,
  recipeID: null,
};