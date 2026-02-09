import { effect, Signal } from '@angular/core';
import { patchState, PartialStateUpdater, signalStoreFeature, withHooks } from '@ngrx/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { RecipeDto } from '../../models/recipe.model';
import { Category } from '../../models/category.model';

type RecipeResource = ReturnType<typeof rxResource<RecipeDto[] | null, unknown>>;

/**
 * Custom store feature pour synchroniser automatiquement les recettes avec leurs enrichissements
 * (catégories et favoris)
 */
export function withRecipeSync<TState extends object>(
  resource: RecipeResource,
  categories: Signal<Category[] | null>,
  userFavorites: Signal<string[]>,
  updateFn: (recipes: RecipeDto[] | null, categories: Category[], userFavorites: string[]) => PartialStateUpdater<TState>
) {
  return signalStoreFeature(
    withHooks({
      onInit(store) {
        effect(() => {
          if (!resource.hasValue()) return;

          const recipes = resource.value();
          const categoriesData = categories();
          const favoritesData = userFavorites();

          if (!categoriesData) return;

          patchState(store, updateFn(recipes, categoriesData, favoritesData));
        });
      }
    })
  );
}
