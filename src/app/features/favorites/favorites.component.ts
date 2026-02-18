import { Component, computed, inject } from "@angular/core";
import { FavoritesStore } from "./store/favorites.store";
import { AuthStore } from "../../stores/auth/auth.store";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { RecipeListComponent } from "../../shared/components/recipe-list/recipe-list.component";
import { ContentFocusComponent } from "../../shared/components/content-focus/content-focus.component";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  imports: [LoaderComponent, RecipeListComponent, ContentFocusComponent],
  providers: [FavoritesStore]
})

export class FavoritesComponent {
  readonly favoritesStore = inject(FavoritesStore);
  readonly authStore = inject(AuthStore);
}