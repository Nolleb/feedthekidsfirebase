import {Component, computed, inject, input, OnInit, signal, untracked} from '@angular/core';
import {AdminRecipeStore} from '../stores/recipes/admin-recipes.store';
import { Recipe } from '../../models/recipe.model';
import { Field, form } from '@angular/forms/signals'
import { createEmptyRecipe, recipeSchema } from './admin-recipe.helper';
import { GlobalStore } from '../../stores/global/global.store';
import { SelectComponent, SelectItem } from '../../shared/aria/select.component';
import { filter, Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { RecipeService } from '../../services/recipes.service';
import { RouterLink } from '@angular/router';
import { SvgIconDirective } from '../../shared/ui/svg/svg-icon.directive';

@Component({
  selector: 'app-admin-recipe-edit',
  templateUrl: './admin-recipe-edit.component.html',
  imports: [
    Field,
    SelectComponent,
    RouterLink,
    SvgIconDirective
  ],
  styleUrls: ['./admin-recipe-edit.component.scss']
})

export class AdminRecipeEditComponent implements OnInit {

  adminRecipesStore = inject(AdminRecipeStore);
  globalStore = inject(GlobalStore);
  recipeService = inject(RecipeService);

  id = input<string>();

  recipe: Recipe | null = null

  recipeModel = signal<Recipe>(createEmptyRecipe());

  recipeForm = form(this.recipeModel, recipeSchema);

  selectCategories = computed(() => this.globalStore.categories()?.map(cat => ({
    label: cat.name,
    value: cat.id
  })));

  selectedCategory: SelectItem | null = null;
  loadRecipeSub?: Subscription;

  constructor() {

    const entities$ = toObservable(this.adminRecipesStore.entities);
    this.loadRecipeSub = entities$.pipe(
      filter(entities => entities && entities.length > 0)
    ).subscribe((entities) => {
      console.log('ENTITIES', entities);
      this.checkAndLoadRecipe();
    });
  }

  ngOnInit() {
    console.log('Admin Recipe Edit ID', this.id());

    if(!this.globalStore.categoriesHasValue()) {
      this.globalStore.reloadCategories();
    }
  }

  checkAndLoadRecipe() {
    if(!this.id() || this.id() === 'new') {
      this.recipe = null
      return;
    }

    const recipeInStore = this.adminRecipesStore.getRecipeById(this.id() as string);
    console.log('Recipe in store', recipeInStore);

    if(recipeInStore) {
      this.loadRecipe(recipeInStore);
    } else {
      this.adminRecipesStore.setSelectedRecipeId(this.id() as string);
    }
  }

  loadRecipe(recipe: Recipe) {
    this.recipe = recipe;
    this.recipeModel.set(this.recipe);
    this.selectedCategory = ({
      label: this.recipeModel().category.name,
      value: this.recipeModel().category.id
    })
  }

  onSaveRecipe() {
    console.info('Recipe to save:', this.recipeModel());
    this.adminRecipesStore.saveRecipe(this.recipeModel())
  }

  addIngredient() {
    this.recipeModel.update(recipe => {
      return {
        ...recipe,
        ingredients: [
          ...recipe.ingredients,
          { quantity: '', name: '' }
        ]
      };
    });

    console.log('After update:', this.recipeModel().ingredients); //OK ingredient added but not in html why ?
  }

  removeIngredient(index: number) {
    this.recipeModel.update(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients.filter((_ , i) => i !== index)
    }));
  }

  updateIngredientQuantity(index: number, event: Event) {
    const quantity = (event.target as HTMLInputElement).value;
    this.recipeModel.update(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients.map((ing, i) => 
        i === index ? { ...ing, quantity: quantity } : ing
      )
    }));
  }

  updateIngredientName(index: number, event: Event) {
    const name = (event.target as HTMLInputElement).value;
    this.recipeModel.update(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients.map((ing, i) => 
        i === index ? { ...ing, name: name } : ing
      )
    }));
  }

  addInstruction() {
    this.recipeModel.update(recipe => {
      const newIndex = recipe.instructions?.length;
      return {
        ...recipe,
        instructions: [
          ...recipe.instructions,
          { index: newIndex, instruction: '' }
        ]
      };
    });
  }

  updateInstructionIndex($index: number, event: Event) {
    const indexToChange = parseInt((event.target as HTMLInputElement).value, 10);
    this.recipeModel.update(recipe => ({
      ...recipe,
      instructions: recipe.instructions.map((ins, i) => 
        i === $index ? { ...ins, index: indexToChange } : ins
      )
    }));
  }

  updateInstructionName(index: number, event: Event) {
    const instruction = (event.target as HTMLInputElement).value;
    this.recipeModel.update(recipe => ({
      ...recipe,
      instructions: recipe.instructions.map((ins, i) => 
        i === index ? { ...ins, instruction: instruction } : ins
      )
    }));
  }

  removeInstruction(index: number) {
    this.recipeModel.update(recipe => ({
      ...recipe,
      instructions: recipe.instructions
        .filter((_, i) => i !== index)
        .map((ing, i) => ({ ...ing, index: i }))
    })
    );
  }

  onCategoryChange(selectedItem: SelectItem) {
    if (selectedItem) {
      const fullCategory = this.globalStore.categories()?.find(cat => cat.id === selectedItem.value);      
      if (fullCategory) {
        this.recipeModel.update(recipe => ({
          ...recipe,
          category: fullCategory
        }));
      }
    }
  }

}


