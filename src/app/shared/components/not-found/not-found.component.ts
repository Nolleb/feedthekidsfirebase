import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import { SvgIconDirective } from '../../ui/svg/svg-icon.directive';
import { getRoutePath } from '../../../app.routes';

@Component({
  standalone: true,
  selector: 'app-not-found',
  templateUrl: 'not-found.component.html',
  styleUrl: 'not-found.component.scss',
})
export class NotFoundComponent {
  title = 'Page introuvable'
  message = 'La page que vous recherchez est introuvable ou a peut‑être été déplacée.'
  private router = inject(Router)
  getRoutePath = getRoutePath

  goHome() {
    this.router.navigate([this.getRoutePath('home')])
  }
}
