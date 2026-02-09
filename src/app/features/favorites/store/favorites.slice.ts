import { Recipe } from "../../../models/recipe.model";

export interface FavoritesSlice {
  recipes: Recipe[] | null;
  userIDs: string[];
}

export const InitialFavoritesSlice: FavoritesSlice = {
  recipes: null,
  userIDs: [],
};