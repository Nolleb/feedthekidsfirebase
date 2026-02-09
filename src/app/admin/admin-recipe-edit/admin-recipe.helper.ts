import { applyEach, required, schema } from "@angular/forms/signals";
import { Recipe } from "../../models/recipe.model";

export function createEmptyRecipe(): Recipe {
  return {
    id: '',
    title: '',
    slug: '',
    description: '',
    duration: '',
    image: '',
    rating: 0,
    personNumber: 1,
    difficulty: "Easy",
    ingredients: [
      { quantity: '', name: '' }
    ],
    instructions: [
      { index: 0, instruction: '' }
    ],
    tags: [],
    category: {
        id: '', name: '',
        color: "",
        icon: "",
        slug: ""
    },
    createdAt: new Date(),
    isThermomix: false,
    isFavorite: false
  };
}

export const recipeSchema = schema<Recipe>((rootPath) => {
  required(rootPath.title, { message: 'Title is required' });
  required(rootPath.slug, { message: 'Slug is required' });
  required(rootPath.category.id, { message: 'Category is required' });
  applyEach(rootPath.ingredients, (ingredientPath) => {
    required(ingredientPath.quantity);
    required(ingredientPath.name);
  });
  applyEach(rootPath.instructions, (instructionPath) => {
    required(instructionPath.instruction);
    required(instructionPath.index);
  });
})