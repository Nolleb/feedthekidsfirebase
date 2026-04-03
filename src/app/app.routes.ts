import {Routes} from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routePaths = {
  home: '',
  category: 'recipes/:category',
  recipeDetail: 'recipe/:id',
  assistedRecipeDetail: 'assisted-recipe/:id',
  adminRecipes: 'admin-recipes',
  adminRecipeEdit: 'admin-recipe-edit',
  favorites: 'favorites',
  assistant: 'assistant'
} as const;

export const getRoutePath = (route: keyof typeof routePaths): string => {
  return `/${routePaths[route]}`;
};

export const routes: Routes = [
  {
    path: routePaths.home,
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Recettes',
  },

  {
    path: routePaths.category,
    loadComponent: () => import('./features/category/category.component').then(m => m.CategoryComponent),
    title: 'Recettes par catégorie',
  },

  {
    path: routePaths.recipeDetail,
    loadComponent: () => import('./features/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent),
    title: 'Détail de la recette',
  },

  {
    path: routePaths.adminRecipes,
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-recipes/admin-recipes.component').then(m => m.AdminRecipesComponent),
    title: 'Admin Recipes',
  },

  {
    path: routePaths.adminRecipeEdit + '/:id',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-recipe-edit/admin-recipe-edit.component').then(m => m.AdminRecipeEditComponent),
    title: 'Admin Edit Recipe',
  },

  {
    path: routePaths.favorites,
    loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent),
    title: 'Liste des favoris',
  },

  {
    path: routePaths.assistant,
     canActivate: [adminGuard],
    loadComponent: () => import('./features/assistant/assistant-creator.component').then(m => m.AssistantCreatorComponent),
    title: 'Assistant Cuisine',
  },

  {
    path: routePaths.assistedRecipeDetail,
    canActivate: [adminGuard],
    loadComponent: () => import('./features/assistant/detail-assistant-recipe/detail-assistant-recipe.component').then(m => m.DetailAssistantRecipeComponent),
    title: 'Détail de la recette assistée',
  },

  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent
  }
];

