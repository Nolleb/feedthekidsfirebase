import { Component, inject, signal } from "@angular/core";
import { AddIcon } from "../../shared/components/svgs/add.component";
import { TrashIcon } from "../../shared/components/svgs/trash.component";
import { ContentFocusComponent } from "../../shared/components/content-focus/content-focus.component";
import { form } from "@angular/forms/signals";
import { assistantRecipeSchema, createAssistantrecipe } from "./assistant-recipe.helper";
import { AssistedRecipeCardComponent } from "../../shared/components/assisted-recipe-card/assisted-recipe-card.component";
import { AssistantStore } from "./store/assistant.store";

@Component({
  selector: "app-assistant-creator",
  templateUrl: "./assistant-creator.component.html",
  styleUrls: ["./assistant-creator.component.scss"],
  standalone: true,
  imports: [AddIcon, TrashIcon, ContentFocusComponent, AssistedRecipeCardComponent]
})

export class AssistantCreatorComponent {

  readonly assistantStore = inject(AssistantStore);

  assistantModel = signal<string[]>(createAssistantrecipe());
  assistantForm = form(this.assistantModel, assistantRecipeSchema);

  newIng = '';

  addIng() {
    const ingredients = this.assistantModel();
    if (this.newIng && !ingredients.includes(this.newIng)) {
      this.assistantModel.set([...ingredients, this.newIng]);
      this.newIng = '';
    }
  }

  removeIng(index: number) {
    const ingredients = this.assistantModel();
    this.assistantModel.set(ingredients.filter((_, i) => i !== index));
  }

  editIng(index: number, event: Event) {
    const ingredients = this.assistantModel();
    const newValue = (event.target as HTMLInputElement).value;
    this.assistantModel.set(ingredients.map((t, i) => i === index ? newValue : t));
  }

  generateRecipes() {
    this.assistantStore.generateRecipes(this.assistantModel());
  }

  clearRecipes() {
    this.assistantStore.clearRecipes();
  }
} 