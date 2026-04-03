import { Component, input } from "@angular/core";

@Component({
  selector: "app-svg[trash-icon]",
  template: `
    <svg class="app-svg" xmlns="http://www.w3.org/2000/svg" id="trash" [attr.viewBox]="viewBox()" [attr.width]="width()" [attr.height]="height()"><path d="M13.77 2.94H9.96V1.56C9.96.7 9.21 0 8.28 0h-2.2C5.15 0 4.4.7 4.4 1.56v1.38H.58a.58.58 0 0 0 0 1.16h.88v8.21c0 1.13.92 2.05 2.05 2.05h7.33c1.13 0 2.05-.92 2.05-2.05v-8.2h.88a.58.58 0 0 0 0-1.16zm-8.21 0V1.56c0-.22.23-.39.52-.39h2.2c.28 0 .52.18.52.39v1.38zm6.16 9.38c0 .49-.4.88-.88.88H3.51c-.49 0-.88-.4-.88-.88V4.11h9.09zm-2.93-2.2V7.19a.58.58 0 0 1 1.16 0v2.93a.58.58 0 0 1-1.16 0m-4.39 0V7.19a.58.58 0 0 1 1.16 0v2.93a.58.58 0 0 1-1.16 0" [attr.fill]="color()"/></svg>
  `,
  host: {
    "[attr.viewBox]": "viewBox()",
    "[style.width.px]": "width()",
    "[style.height.px]": "height()",
    "[style.display]": "'flex'",
    "[style.color]": "color()",
  },
})
export class TrashIcon {
  readonly viewBox = input<string>("0 0 14.35 14.36");
  readonly width = input<number>(12);
  readonly height = input<number>(12);
  readonly color = input<string>("currentColor");
}
