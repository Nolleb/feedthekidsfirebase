import { Component, inject, input, linkedSignal } from "@angular/core";
import { Recipe } from "../../../models/recipe.model";
import { Router, RouterLink } from "@angular/router";
import { SvgIconDirective } from "../../ui/svg/svg-icon.directive";
import { getCloudinaryUrl } from "../../utils/display-image";
import { categoryWithMultipleColors } from "../../utils/category-with-multiple-colors";
import { DisplayStarComponent } from "../../ui/display-star/display-star.component";
import { ToggleFavoriteComponent } from "../toggle-favorite/toggle-favorite.component";
import { UserService } from "../../../services/user.service";
import { AuthStore } from "../../../stores/auth/auth.store";

@Component({
  selector: 'recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
  imports: [RouterLink, SvgIconDirective, DisplayStarComponent, ToggleFavoriteComponent]
})

export class RecipeCardComponent {
  readonly userService = inject(UserService);
  readonly authStore = inject(AuthStore);

  recipe = input<Recipe>();
  isFavorite = linkedSignal(() => this.recipe()?.isFavorite ?? false);
  getCloudinaryUrl = getCloudinaryUrl;
  categoryWithMultipleColors = categoryWithMultipleColors

  getAssociatedCategoryColor(type: 'rating' | 'favorite' | 'infos'): string {
    const slug = this.recipe()?.category?.slug;
    if (!slug) return 'lightgrey';
    const colors = this.categoryWithMultipleColors[slug as keyof typeof this.categoryWithMultipleColors];
    return colors?.[type] ?? 'lightgrey';
  }

  onToggleFavorite() {
    const userID = this.authStore.getUserId()
    console.info('USER ID', userID);
    const recipe = this.recipe();
    if(!userID || !recipe) return;
    
    this.userService.toggleFavorite(userID, recipe.id, recipe.isFavorite).subscribe({
      next: () => {
        console.info('✅ Favori mis à jour');
      },
      error: (err) => {
        console.error('❌ Erreur toggle favorite:', err);
      }
    });
  }

}