import { Recipe, RecipesListConfig } from "../../../models/recipe.model";

export interface RecipeListSlice {
  recipes: Recipe[] | null;
  slug: string | null;
  hasMoreRecipes: boolean;

  recipeListConfig: RecipesListConfig;
}

export const InitialRecipeListSlice: RecipeListSlice = {
  recipes: null,
  slug: null,
  hasMoreRecipes: false,
 
  recipeListConfig: {
    page: 1,
    limit: 10,
    pageLastElements: new Map<number, Recipe>(),
  },
};