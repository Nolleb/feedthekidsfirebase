import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AuthStore } from '../../../stores/auth/auth.store';
import { SvgIconDirective } from '../../ui/svg/svg-icon.directive';
import { Role } from '../../../models/user.model';
import { Router } from '@angular/router';
import { getRoutePath } from '../../../app.routes';

@Component({
  selector: 'app-auth-button',
  standalone: true,
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
  imports: [SvgIconDirective]
})
export class AuthButtonComponent {

  authService = inject(AuthService);
  authStore = inject(AuthStore);
  router = inject(Router);

  role = computed(() => this.authStore.getUserRole());
  roleAdmin = Role.ADMIN

  signInWithGoogle() {
    this.authService.signInWithGoogle().subscribe({
      next: () => {
        console.log('✅ Connecté');
      },
      error: (error) => {
        console.error('❌ Erreur:', error);
      }
    });
  }

  signOut() {
    this.authService.signOut().subscribe({
      next: () => {
        console.log('✅ Déconnecté');
      },
      error: (error) => {
        console.error('❌ Erreur:', error);
      }
    });
  }

  onGoToAdminPage() {
    this.router.navigate([getRoutePath('adminRecipes')]);
  }
}
