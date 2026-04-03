import {PartialStateUpdater} from "@ngrx/signals";
import { DetailAssistantSlice } from "./detail-assistant.slice";
import { AssistedRecipe } from "../../../../models/recipe.model";

export function updateRecipeByID(recipes:AssistedRecipe[], id: string): PartialStateUpdater<DetailAssistantSlice> {  
  return state => ({
    ...state,
    assistantRecipe: recipes.find(recipe => recipe.id === id) || null
  })
}
