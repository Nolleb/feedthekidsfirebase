import {Component, inject} from '@angular/core';
import {AdminRecipeStore} from '../stores/recipes/admin-recipes.store';
import { Router } from '@angular/router';
import { getRoutePath } from '../../app.routes';
import { SafeDatePipe } from "../../pipes/safe-date.pipe";

@Component({
  selector: 'app-admin-recipes',
  templateUrl: './admin-recipes.component.html',
  imports: [
    SafeDatePipe
],
  styleUrls: ['./admin-recipes.component.scss']
})

export class AdminRecipesComponent {

  adminRecipesStore = inject(AdminRecipeStore)
  router = inject(Router);

  protected onOpenRecipe(id: string) {
    this.router.navigate([getRoutePath('adminRecipeEdit'), id]);
    console.log('Admin Recipes Open', id);
  }

  onCreateRecipe(id: string) {
    this.router.navigate([getRoutePath('adminRecipeEdit'), id]);
  }
}
