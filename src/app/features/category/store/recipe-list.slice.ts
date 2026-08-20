export interface RecipeListSlice {
  slug: string | null;
  //hasMoreRecipes: boolean;

  //recipeListConfig: RecipesListConfig;
}

export const InitialRecipeListSlice: RecipeListSlice = {
  slug: null,
  //hasMoreRecipes: false,

  /*recipeListConfig: {
    page: 1,
    limit: 10,
    pageLastElements: new Map<number, Recipe>(),
  },*/
};
