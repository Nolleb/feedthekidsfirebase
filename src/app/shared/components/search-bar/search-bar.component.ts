import { Component, output } from "@angular/core";
import { SvgIconDirective } from "../../ui/svg/svg-icon.directive";

@Component({
  selector: 'app-search',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  imports: [SvgIconDirective]
})

export class SearchBarComponent {

  searchTermChange = output<string>();
  
  onSearchTerm(term: string) {
    this.searchTermChange.emit(term);
  }

}