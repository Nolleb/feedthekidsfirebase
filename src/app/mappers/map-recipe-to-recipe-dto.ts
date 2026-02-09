import { Timestamp } from "@angular/fire/firestore";
import { Recipe, RecipeDto } from "../models/recipe.model";

export function mapRecipeToRecipeDto(recipe: Recipe): RecipeDto {
    const createdAtAsTimestamp = (date: Date): Timestamp => {
        return Timestamp.fromDate(date);
    }

    const recipeDto: RecipeDto = {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        duration: recipe.duration,
        personNumber: recipe.personNumber,
        rating: recipe.rating,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags,
        image: recipe.image,
        difficulty: recipe.difficulty,
        isThermomix: recipe.isThermomix,
        categoryID: recipe.category.id,
        slug: recipe.slug,
        createdAt: createdAtAsTimestamp(recipe.createdAt),
    };

    return recipeDto;
}