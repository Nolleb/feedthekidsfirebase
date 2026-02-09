import { Recipe } from "../../../models/recipe.model";

export interface HomeSlice {
  lastRecipes: Recipe[] | null;
  searchedRecipes: Recipe[] | null;
  userFavorites: string[];
  searchTerm: string;
}

export const InitialHomeSlice: HomeSlice = {
  lastRecipes: null,
  searchedRecipes: null,
  userFavorites: [],
  searchTerm: '',
};