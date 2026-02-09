import {Component, input, Input, OnInit} from '@angular/core';
import { SvgIconDirective } from '../svg/svg-icon.directive';

@Component({
  selector: 'app-display-star',
  templateUrl: './display-star.component.html',
  styleUrls: ['./display-star.component.scss'],
  imports: [SvgIconDirective]
})
export class DisplayStarComponent implements OnInit {
  rating = input<number>(0);
  color = input<string>('#FFDE55');
  fontSize = input<string>('24px');

  max: number = 5
  numbers: Array<number> = Array.from({ length: this.max }, (_, i) => i)

  ngOnInit(): void {
    this.numbers = Array(this.max).fill(this.rating).map((_x,i)=>i)
  }
}
