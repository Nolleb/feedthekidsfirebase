import { inject, computed, Signal, effect } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { RecipeService } from '../services/recipes.service';
import { Category } from '../models/category.model';
import { mapRecipesDtoToRecipes } from '../mappers/map-recipes-dto-to-recipes';
import { Recipe } from '../models/recipe.model';

export function withSearchedRecipes(
  trackingSignal: () => {
    categories: Signal<Category[] | null>;
    userFavorites: string[];
  },
) {
  return signalStoreFeature(
    withState({
      searchTerm: '',
      searchedRecipesUpdated: null as Recipe[] | null,
    }),
    withProps(() => ({
      _recipesService: inject(RecipeService),
    })),

    withMethods((store) => ({
      setSearchTerm(term: string) {
        patchState(store, { searchTerm: term });
      },
    })),

    withProps((store) => ({
      _searchedRecipes: store._recipesService.searchRecipesResource(
        store.searchTerm,
        trackingSignal().categories,
      ),
    })),

    withComputed((store) => {
      const searchedRecipesLoading = computed(() => store._searchedRecipes.isLoading());
      const hasSearchTerm = computed(() => store.searchTerm().trim().length > 0);
      const hasSearchResults = computed(() => {
        const recipes = store._searchedRecipes.value();
        return recipes !== null && recipes && recipes.length > 0;
      });

      return {
        searchedRecipesLoading,
        hasSearchTerm,
        hasSearchResults,
      };
    }),
    withHooks((store) => ({
      onInit() {
        effect(() => {
          const { categories, userFavorites } = trackingSignal();

          patchState(store, {
            searchedRecipesUpdated:
              mapRecipesDtoToRecipes(
                store._searchedRecipes.value() ?? [],
                categories() ?? [],
                userFavorites,
              ) ?? [],
          });
        });
      },
    })),
  );
}
