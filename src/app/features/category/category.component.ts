import { Component, inject, input } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { GlobalStore } from "../../stores/global/global.store";
import { getRoutePath } from "../../app.routes";
import { RecipeListStore } from "./store/recipe-list.store";
import { RecipeListComponent } from "../../shared/components/recipe-list/recipe-list.component";
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  imports: [RecipeListComponent, PaginatorComponent, JsonPipe],
  providers: [RecipeListStore]

})

export class CategoryComponent {
  readonly globalStore = inject(GlobalStore);
  readonly recipeListStore = inject(RecipeListStore);
  
  category = input<string>();
  getRoutePath = getRoutePath

  ngOnInit(): void {

    if(this.category) {
      this.recipeListStore.setCategorySlug(this.category() as string);
    }
  }
}