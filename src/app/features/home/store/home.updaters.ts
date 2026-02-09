import {PartialStateUpdater} from "@ngrx/signals";
import { mapRecipesDtoToRecipes } from "../../../mappers/map-recipes-dto-to-recipes";
import { RecipeDto } from "../../../models/recipe.model";
import { Category } from "../../../models/category.model";
import { HomeSlice } from "./home.slice";

export function updateLastRecipes(recipes: RecipeDto[] | null, categories: Category[], userFavorites: string[] = []): PartialStateUpdater<HomeSlice> {  
  return state => ({
    ...state,
    lastRecipes: recipes ? mapRecipesDtoToRecipes(recipes, categories, userFavorites) : []
  })
}

export function updateSearchedRecipes(recipes: RecipeDto[] | null, categories: Category[], userFavorites: string[] = []): PartialStateUpdater<HomeSlice> {  
  return state => ({
    ...state,
    searchedRecipes: recipes ? mapRecipesDtoToRecipes(recipes, categories, userFavorites) : []
  })
}
