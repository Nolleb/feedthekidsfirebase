import {Recipe} from '../../../models/recipe.model';

export interface AdminRecipeSlice {
  recipes: Recipe[] | null;
  selectedRecipeId: string | null;
}

export const InitialAdminRecipeSlice: AdminRecipeSlice = {
  recipes: null,
  selectedRecipeId: null
};
