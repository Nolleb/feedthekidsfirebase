import { Component, input, model, output } from "@angular/core";
import { SvgIconDirective } from "../../ui/svg/svg-icon.directive";

@Component({
  selector: 'app-toggle-favorite',
  templateUrl: './toggle-favorite.component.html',
  styleUrls: ['./toggle-favorite.component.scss'],
  imports: [SvgIconDirective]
})

export class ToggleFavoriteComponent {
  iconSize = input<string>('24px');
  iconColor = input<string>('#FFDE55');
  isFavorite = model<boolean>(false);
  
  onToggle = output<void>();

  updateFavorite(){
    this.isFavorite.update(value => !value);
    this.onToggle.emit();
  }
}