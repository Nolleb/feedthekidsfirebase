import { Timestamp } from "@angular/fire/firestore";
import { Category } from "../models/category.model";
import { Recipe, RecipeDto } from "../models/recipe.model";

export function mapRecipesDtoToRecipes(recipesDto: RecipeDto[], categories: Category[], userFavorites: string[] = []): Recipe[] {

    const createdAtAsDate = (timestamp: Timestamp): Date => {
        const date = timestamp.toDate();
        return date;
    }

    const recipes = recipesDto.map(dto => {
        const category = categories.find(cat => cat.id === dto.categoryID) as Category;
        
        return {
            id: dto.id,
            title: dto.title,
            description: dto.description,
            duration: dto.duration,
            personNumber: dto.personNumber,
            rating: dto.rating,
            ingredients: dto.ingredients,
            instructions: dto.instructions,
            tags: dto.tags,
            image: dto.image,
            difficulty: dto.difficulty,
            isThermomix: dto.isThermomix,
            slug: dto.slug,
            createdAt: createdAtAsDate(dto.createdAt),
            category: category,
            isFavorite: userFavorites.includes(dto.id)
        };
    });

    return recipes
}

