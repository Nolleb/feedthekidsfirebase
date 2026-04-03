import { Component, input } from "@angular/core";

@Component({
  selector: "app-svg[add-icon]",
  template: `
    <svg class="app-svg" xmlns="http://www.w3.org/2000/svg" id="add" [attr.viewBox]="viewBox()" [attr.width]="width()" [attr.height]="height()"><path clip-rule="evenodd" d="M50.833 25.417c0-1.15-.933-2.083-2.083-2.083H27.5V2.084a2.084 2.084 0 0 0-4.167 0v21.25H2.083a2.084 2.084 0 0 0 0 4.166h21.25v21.25a2.084 2.084 0 0 0 4.167 0V27.5h21.25c1.15 0 2.083-.933 2.083-2.083" [attr.fill]="color()" fill-rule="evenodd"/></svg>
  `,
  host: {
    "[attr.viewBox]": "viewBox()",
    "[style.width.px]": "width()",
    "[style.height.px]": "height()",
    "[style.display]": "'flex'",
    "[style.color]": "color()",
  },
})
export class AddIcon {
  readonly viewBox = input<string>("0 0 50.833 50.833");
  readonly width = input<number>(12);
  readonly height = input<number>(12);
  readonly color = input<string>("currentColor");
}
