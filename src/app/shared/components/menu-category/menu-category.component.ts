import { Component, input } from "@angular/core";
import { Category } from "../../../models/category.model";
import { RouterLink } from "@angular/router";
import { SvgIconDirective } from "../../ui/svg/svg-icon.directive";

@Component({
  standalone: true,
  selector: 'menu-category',
  templateUrl: './menu-category.component.html',
  styleUrls: ['./menu-category.component.scss'],
  imports: [RouterLink, SvgIconDirective]
})

export class MenuCategoryComponent {
  categories = input<Category[] | null>();
}