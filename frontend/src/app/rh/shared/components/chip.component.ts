import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chip',
  standalone: true,
    imports: [CommonModule],

  template: `<span class="chip" [ngClass]="cssClass()">{{ label() }}</span>`,
  host: { '[style.display]': '"inline"' }
})
export class ChipComponent {
  label = input<string>('');
  type  = input<'vert' | 'jaune' | 'bleu' | 'rouge' | 'gris' | 'orange'>('gris');

  cssClass = computed(() => {
    const map: Record<string, string> = {
      vert: 'cv', jaune: 'cp', bleu: 'cb', rouge: 'cr', gris: 'cg', orange: 'cgo'
    };
    return map[this.type()] ?? 'cp';
  });
}
