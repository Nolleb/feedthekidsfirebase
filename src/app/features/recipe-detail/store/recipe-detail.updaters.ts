import {PartialStateUpdater} from "@ngrx/signals";
import { mapRecipesDtoToRecipes } from "../../../mappers/map-recipes-dto-to-recipes";
import { RecipeDto } from "../../../models/recipe.model";
import { Category } from "../../../models/category.model";
import { RecipeDetailSlice } from "./recipe-detail.slice";

export function updateRecipe(recipe: RecipeDto | null, categories: Category[], userFavorites: string[] = []): PartialStateUpdater<RecipeDetailSlice> {  
  return state => ({
    ...state,
    recipe: recipe ? mapRecipesDtoToRecipes([recipe], categories, userFavorites)[0] : null
  })
}
