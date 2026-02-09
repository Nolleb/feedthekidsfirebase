import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { SvgIconDirective } from "../../ui/svg/svg-icon.directive";
import { AuthButtonComponent } from "../auth-button/auth-button.component";
import { getRoutePath } from "../../../app.routes";
import { AuthStore } from "../../../stores/auth/auth.store";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, SvgIconDirective, AuthButtonComponent]
})

export class HeaderComponent {
  readonly authStore = inject(AuthStore);
  readonly router = inject(Router);
  getRoutePath = getRoutePath

  onFavoritePage(){
    this.router.navigate([getRoutePath('favorites')]);
  }
}