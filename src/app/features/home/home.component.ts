import { Component, inject } from "@angular/core";
import { GlobalStore } from "../../stores/global/global.store";
import { getRoutePath } from "../../app.routes";
import { MenuCategoryComponent } from "../../shared/components/menu-category/menu-category.component";
import { SearchBarComponent } from "../../shared/components/search-bar/search-bar.component";
import { RecipeListComponent } from "../../shared/components/recipe-list/recipe-list.component";
import { HomeStore } from "./store/home.store";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { ContentFocusComponent } from "../../shared/components/content-focus/content-focus.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [MenuCategoryComponent, SearchBarComponent, RecipeListComponent, LoaderComponent, ContentFocusComponent],
  providers: [HomeStore]
})

export class HomeComponent {

  readonly globalStore = inject(GlobalStore);
  readonly homeStore = inject(HomeStore);
  getRoutePath = getRoutePath

  GREYCOLOR = '#828080';

  onSearchTerm($event: string) { 
    this.homeStore.setSearchTerm($event);
  }
}