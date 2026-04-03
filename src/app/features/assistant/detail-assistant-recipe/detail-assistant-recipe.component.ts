import { Component, inject, input, OnInit, signal } from "@angular/core";
import { BoldPipe } from "../../../pipes/bold.pipe";
import { Router } from "@angular/router";
import { SvgIconDirective } from "../../../shared/ui/svg/svg-icon.directive";
import { getRoutePath } from "../../../app.routes";
import { ContentFocusComponent } from "../../../shared/components/content-focus/content-focus.component";
import { DetailAssistantStore } from "./store/detail-assistant.store";

@Component({
  selector: 'app-detail-assistant-recipe',
  templateUrl: './detail-assistant-recipe.component.html',
  styleUrls: ['./detail-assistant-recipe.component.scss'],
  imports: [BoldPipe, SvgIconDirective, ContentFocusComponent],
  providers: [DetailAssistantStore]
})

export class DetailAssistantRecipeComponent implements OnInit {
  id = input<string>();
  
  router = inject(Router);
  assistantRecipeStore = inject(DetailAssistantStore);
  showIngredients = signal(true);
  
  getRoutePath = getRoutePath;
  
  ngOnInit(): void {
    if(!this.id()) {
      return;
    }
    this.assistantRecipeStore.setSelectedRecipeId(this.id() as string);
  }

  toggleInformations() {
    this.showIngredients.update(value => !value);
  }

  onBackToAssistantPage() {
    this.router.navigate([getRoutePath('assistant')]);
  }
}