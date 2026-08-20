import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { computed, effect, inject } from '@angular/core';
import { RecipeService } from '../services/recipes.service';
import { UserService } from '../services/user.service';
import { Category } from '../models/category.model';
import { Recipe, RecipesListConfig } from '../models/recipe.model';
import { mapRecipesDtoToRecipes } from '../mappers/map-recipes-dto-to-recipes';

export function withCategorizedRecipes(
  trackingSignals: () => {
    categories: Category[];
    userFavorites: string[];
    recipeListConfig: RecipesListConfig;
  },
) {
  return signalStoreFeature(
    withState({
      slug: null as string | null,
      categorizedRecipesUpdated: null as Recipe[] | null,
      _hasMoreRecipes: false,
    }),
    withProps(() => ({
      _recipesService: inject(RecipeService),
    })),

    withMethods((store) => ({
      setCategorySlug(categorySlug: string) {
        patchState(store, { slug: categorySlug });
      },
    })),

    withComputed((store) => {
      const categoryID = computed(() => {
        const categories = trackingSignals().categories;
        const slug = store.slug();
        if (!categories || !slug) return null;
        const category = categories.find((c) => c.slug === slug);
        return category?.id ?? null;
      });

      return { categoryID };
    }),

    withProps((store) => ({
      _recipeList: store._recipesService.getRecipeResourceBySlug(
        store.categoryID,
        computed(() => trackingSignals().recipeListConfig),
      ),
    })),

    withComputed((store) => {
      const recipesLoading = computed(() => store._recipeList.isLoading());
      const error = computed(() => store._recipeList.error());
      const hasError = computed(() => !!error());

      return {
        recipesLoading,
        error,
        hasError,
      };
    }),

    withHooks((store) => ({
      onInit() {
        effect(() => {
          const { categories, userFavorites } = trackingSignals();

          patchState(store, {
            categorizedRecipesUpdated:
              mapRecipesDtoToRecipes(
                store._recipeList.value()?.recipes ?? [],
                categories,
                userFavorites,
              ) ?? [],
            _hasMoreRecipes: store._recipeList.value()?.hasMore as boolean,
          });
        });
      },
    })),
  );
}
