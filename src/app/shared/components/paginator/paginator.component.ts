import { Component, input, output } from '@angular/core';
import { SvgIconDirective } from "../../ui/svg/svg-icon.directive";

export interface PaginatorConfig {
  show: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  standalone: true,
  imports: [SvgIconDirective],
})
export class PaginatorComponent {
  paginator = input.required<PaginatorConfig>();
  onNextClicked = output<void>();
  onPrevClicked = output<void>();
}