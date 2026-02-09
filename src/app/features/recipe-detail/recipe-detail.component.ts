import { Component, inject, input, OnInit, signal } from "@angular/core";
import { RecipeDetailStore } from "./store/recipe-detail.store";
import { GlobalStore } from "../../stores/global/global.store";
import { categoryWithMultipleColors } from "../../shared/utils/category-with-multiple-colors";
import { getCloudinaryUrl } from "../../shared/utils/display-image";
import { SvgIconDirective } from "../../shared/ui/svg/svg-icon.directive";
import { SafeDatePipe } from "../../pipes/safe-date.pipe";
import { Router } from "@angular/router";
import { getRoutePath } from "../../app.routes";
import { DisplayStarComponent } from "../../shared/ui/display-star/display-star.component";
import { ToggleFavoriteComponent } from "../../shared/components/toggle-favorite/toggle-favorite.component";
import { BoldPipe } from "../../pipes/bold.pipe";
import { Recipe } from "../../models/recipe.model";
import { UserService } from "../../services/user.service";
import { AuthStore } from "../../stores/auth/auth.store";
import { ContentFocusComponent } from "../../shared/components/content-focus/content-focus.component";

@Component({
  selector: 'recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
  providers: [RecipeDetailStore],
  imports: [SvgIconDirective, SafeDatePipe, DisplayStarComponent, ToggleFavoriteComponent, BoldPipe, ContentFocusComponent]
})
export class RecipeDetailComponent implements OnInit {

  id = input<string>();

  readonly recipeDetailStore = inject(RecipeDetailStore);
  readonly globalStore = inject(GlobalStore);
  readonly authStore = inject(AuthStore);
  readonly userService = inject(UserService);
  readonly router = inject(Router);

  showIngredients = signal(true);
  categoryWithMultipleColors = categoryWithMultipleColors
  getCloudinaryUrl = getCloudinaryUrl;
  getRoutePath = getRoutePath

  ngOnInit(): void {
    if(this.id()) {
      this.recipeDetailStore.setRecipeId(this.id() as string);
    }        
  }

  toggleInformations() {
    this.showIngredients.update(value => !value);
  }

  onToggleFavorite(recipe: Recipe | null) {
    const userID = this.authStore.getUserId()
    if(!userID || !recipe) return;
    const favorite = recipe.isFavorite;
    this.userService.toggleFavorite(userID, recipe!.id, favorite).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('❌ Erreur toggle favorite:', err);
      }
    });
  }

  getAssociatedCategoryColor(type: 'rating' | 'favorite' | 'infos'): string {
    const slug = this.recipeDetailStore.recipe()?.category?.slug;
    if (!slug) return 'lightgrey';
    const colors = this.categoryWithMultipleColors[slug as keyof typeof this.categoryWithMultipleColors];
    return colors?.[type] ?? 'lightgrey';
  }

  getLightColor(type: 'rating' | 'favorite' | 'infos'): string {
    const color = this.getAssociatedCategoryColor(type);
    if (color.startsWith('#')) {
      const r = Math.floor(parseInt(color.slice(1, 3), 16) * 0.85);
      const g = Math.floor(parseInt(color.slice(3, 5), 16) * 0.85);
      const b = Math.floor(parseInt(color.slice(5, 7), 16) * 0.85);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  }

  onBackToCategoryList(slug: string | undefined) {
    if(!slug) {
      this.router.navigate([getRoutePath('home')]);
    };

    this.router.navigate(['/recipes', slug]);
  }
} 
 