import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxPopupContainer,
} from '@angular/aria/combobox';
import {Listbox, Option} from '@angular/aria/listbox';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay';
import { isNotFound } from '@angular/core/primitives/di';

export interface SelectItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  imports: [
    Combobox,
    ComboboxInput,
    ComboboxPopup,
    ComboboxPopupContainer,
    Listbox,
    Option,
    OverlayModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {

  //select ITEMS 
  selectItems = input<SelectItem[]>([]);
  placeholder = input<string>('Select a label');
  selectedValue = model<SelectItem | null>(null);

  onSelect = output<SelectItem>();

  /** The combobox listbox popup. */
  listbox = viewChild<Listbox<string>>(Listbox);
  /** The options available in the listbox. */
  options = viewChildren<Option<string>>(Option);
  /** A reference to the ng aria combobox. */
  combobox = viewChild<Combobox<string>>(Combobox);
  
  displayValue = computed(() => {
    const selected = this.selectedValue();
    if (selected) {
      return this.selectItems().find(item => item.value === selected.value)?.label || this.placeholder();
    }
    const values = this.listbox()?.values() || [];
    return values.length ? values[0] : this.placeholder();
  });

  constructor() {
    // Scrolls to the active item when the active option changes.
    // The slight delay here is to ensure animations are done before scrolling.
    afterRenderEffect(() => {
      const option = this.options().find((opt) => opt.active());
      setTimeout(() => option?.element.scrollIntoView({block: 'nearest'}), 50);
    });
    // Resets the listbox scroll position when the combobox is closed.
    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
      }
    });

    effect(() => {
      const listboxRef = this.listbox();
      
      if (!listboxRef) {
        return;
      }
      
      const values = listboxRef.values();
      
      if (values && values.length > 0) {
        const item = this.selectItems().find(it => it.value === values[0]);
        this.selectedValue.set(item ?? null);
        if(item) {
          this.onSelect.emit(item);
        }
      }
    });
  }
}