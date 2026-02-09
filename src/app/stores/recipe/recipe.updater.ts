import {PartialStateUpdater} from "@ngrx/signals";
import { RecipeDto } from "../../models/recipe.model";
import { RecipeSlice } from "./recipe.slice";
import { mapRecipesDtoToRecipes } from "../../mappers/map-recipes-dto-to-recipes";
import { Category } from "../../models/category.model";

export function updateRecipes(recipes: RecipeDto[], categories: Category[], userFavorites: string[] = []): PartialStateUpdater<RecipeSlice> {
  return state => ({
    ...state,
    recipes: mapRecipesDtoToRecipes(recipes, categories, userFavorites)
  })
}

export function filterRecipesByCategory(categorySlug: string): PartialStateUpdater<RecipeSlice> {
  return state => ({
    ...state,
    filteredRecipes: state.recipes?.filter(recipe => recipe.category?.slug === categorySlug) ?? []
  })
}

export function filterRecipeByID(id: string): PartialStateUpdater<RecipeSlice> {
  return state => ({
    ...state,
    recipeDetail: state.recipes?.find(recipe => recipe.id === id) ?? null
  })
}