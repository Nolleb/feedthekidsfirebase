import { Component, input } from "@angular/core";

@Component({
  selector: 'app-content-focus',
  templateUrl: './content-focus.component.html',
  styleUrls: ['./content-focus.component.scss']
})
export class ContentFocusComponent {
  borderColor = input<string>('#ccc');
  description = input<string>();
  fontSize = input<string>('14px');
  textColor = input<string>('#151515');
}