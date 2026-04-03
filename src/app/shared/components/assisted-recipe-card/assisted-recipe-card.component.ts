import { Component, inject, input } from "@angular/core";
import { AssistedRecipe } from "../../../models/recipe.model";
import { RouterLink } from "@angular/router";
import { SvgIconDirective } from "../../ui/svg/svg-icon.directive";
import { UserService } from "../../../services/user.service";
import { AuthStore } from "../../../stores/auth/auth.store";

@Component({
  selector: 'assisted-recipe-card',
  templateUrl: './assisted-recipe-card.component.html',
  styleUrls: ['./assisted-recipe-card.component.scss'],
  imports: [RouterLink, SvgIconDirective]
})

export class AssistedRecipeCardComponent {
  readonly userService = inject(UserService);
  readonly authStore = inject(AuthStore);

  recipe = input<AssistedRecipe>();
}