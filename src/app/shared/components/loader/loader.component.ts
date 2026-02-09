import { Component, input } from "@angular/core";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent {
  hasAbsolutePosition = input<boolean>(false);
}