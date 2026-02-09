import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeDate'
})
export class SafeDatePipe implements PipeTransform {
  transform(value: string | Date | number | null | undefined, format: string = 'dd/MM/yy à HH:mm'): string {
    if (!value) return '' 

    try {

      let date: Date
        if (typeof value === 'string') {
        // Fix pour Safari iOS : forcer l'interprétation comme heure locale
        const normalizedValue = value.replace('T', ' ').split('.')[0];
        date = new Date(normalizedValue);
      } else {
        date = value instanceof Date ? value : new Date(value);
      }

      if (isNaN(date.getTime())) {
        return '';
      }

      // safari
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Paris',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };

      const formatter = new Intl.DateTimeFormat('fr-FR', options);
      const parts = formatter.formatToParts(date);

      const day = parts.find(p => p.type === 'day')?.value || '';
      const month = parts.find(p => p.type === 'month')?.value || '';
      const year = parts.find(p => p.type === 'year')?.value || '';
      const hour = parts.find(p => p.type === 'hour')?.value || '';
      const minute = parts.find(p => p.type === 'minute')?.value || '';

      return `${day}/${month}/${year} à ${hour}h${minute}`;
    } catch (error) {
      return '';
    }
  }
}