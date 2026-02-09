import {PartialStateUpdater} from "@ngrx/signals";
import { mapRecipesDtoToRecipes } from "../../../mappers/map-recipes-dto-to-recipes";
import { RecipeDto } from "../../../models/recipe.model";
import { Category } from "../../../models/category.model";
import { FavoritesSlice } from "./favorites.slice";

export function updateRecipes(recipes: RecipeDto[] | null, categories: Category[], userFavorites: string[] = []): PartialStateUpdater<FavoritesSlice> {  
  return state => ({
    ...state,
    recipes: recipes ? mapRecipesDtoToRecipes(recipes, categories, userFavorites) : []
  })
}
