import { Component, inject, input, OnInit } from "@angular/core";
import { RecipeListStore } from "../../../features/category/store/recipe-list.store";
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";
import { Recipe } from "../../../models/recipe.model";

@Component({
  selector: 'recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
  imports: [RecipeCardComponent],
})

export class RecipeListComponent {
  recipes = input<Recipe[] | null>(null);
}