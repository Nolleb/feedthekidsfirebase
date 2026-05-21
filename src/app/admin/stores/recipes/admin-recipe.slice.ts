import {Recipe, RecipesListConfig} from '../../../models/recipe.model';

export interface AdminRecipeSlice {
  recipes: Recipe[] | null;
  selectedRecipeId: string | null;
  hasMoreRecipes: boolean;
  recipeListConfig: RecipesListConfig;
}

export const InitialAdminRecipeSlice: AdminRecipeSlice = {
  recipes: null,
  selectedRecipeId: null,
  hasMoreRecipes: false,
  recipeListConfig: {
    page: 1,
    limit: 10,
    pageLastElements: new Map<number, Recipe>(),
  },
};
