import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecipeStore } from './stores/recipe/recipe.store';
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('feedthekidswithfirebase');
  private recipeStore = inject(RecipeStore);
  
  recipes = computed(() => this.recipeStore.recipes());

  ngOnInit() {

    console.info('RECIPES MAPPES DANS APP', this.recipes());

  }
}
