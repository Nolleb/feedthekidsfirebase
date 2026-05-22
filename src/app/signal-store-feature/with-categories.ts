import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { CategoryService } from '../services/categories.service';
import { computed, effect, inject } from '@angular/core';
import { Category } from '../models/category.model';

export function withCategories() {
  return signalStoreFeature(
    //withLocalStorage('categories'),
    withState({ _categoriesCache: null as Category[] | null }),
    withProps(() => ({
      _categoryService: inject(CategoryService),
    })),

    withProps((store) => ({
      _categories: store._categoryService.categoriesResource,
    })),

    withComputed((store) => {
      const categoriesLoading = computed(() => store._categories.isLoading());
      const categoriesHasValue = computed(() => store._categories.hasValue());
      const categories = computed(
        () => store._categoriesCache() ?? store._categories.value() ?? null,
      );
      const error = computed(() => store._categories.error());
      const hasError = computed(() => !!error());

      return {
        categoriesLoading,
        error,
        hasError,
        categoriesHasValue,
        categories,
      };
    }),

    withMethods((store) => ({
      reloadCategories() {
        store._categories.reload();
      },
    })),

    withHooks((store) => ({
      onInit() {
        // Charger le cache au démarrage
        const cached = localStorage.getItem('categories');
        if (cached) patchState(store, { _categoriesCache: JSON.parse(cached) });

        // Sauvegarder quand la resource Firestore répond
        effect(() => {
          const val = store._categories.value();
          if (val) {
            patchState(store, { _categoriesCache: val });
            localStorage.setItem('categories', JSON.stringify(val));
          }
        });
      },
    })),
  );
}
