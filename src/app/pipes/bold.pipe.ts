import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'textBold'
})

export class BoldPipe implements PipeTransform {
  transform(value: string): string {
    const regex = /\*\*(.*?)\*\*/g;
    return value.replace(regex, (match, p1) => `<strong class="font-500">${p1}</strong>`);
  }
}
