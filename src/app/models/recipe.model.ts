import { Timestamp } from "@angular/fire/firestore"
import { Difficulty } from "../types/difficulty.type"
import { Category } from "./category.model"

export interface RecipeDto {
  id: string
  title: string
  description: string
  duration: string
  personNumber: number
  rating: number
  ingredients: Ingredient[]
  instructions: Instruction[]
  tags: string[];
  image: string;
  difficulty: Difficulty;
  isThermomix: boolean;
  categoryID: string;
  slug: string;
  createdAt: Timestamp;
}

export interface Recipe {
  id: string
  title: string
  description: string
  duration: string
  personNumber: number
  rating: number
  ingredients: Ingredient[]
  instructions: Instruction[]
  tags: string[];
  image: string;
  difficulty: Difficulty;
  isThermomix: boolean;
  slug: string;
  createdAt: Date; //mapper
  category: Category //mapper
  isFavorite: boolean;
}

export interface Instruction {
  index: number
  instruction: string
}

export interface Ingredient {
  quantity: string
  name: string
}

export interface RecipesListConfig {
  page: number;
  limit: number;
  pageLastElements: Map<number, Recipe>;
}
