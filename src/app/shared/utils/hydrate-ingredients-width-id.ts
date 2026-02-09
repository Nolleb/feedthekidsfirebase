import { Ingredient } from "../../models/recipe.model";
import { generateUiId } from "./generate-id";

export function hydrateIngredientUiIds(ingredients: Ingredient[]): Ingredient[] {
  return ingredients.map(ingredient => ({
    ...ingredient,
    _uiId: generateUiId()
  }));
}

