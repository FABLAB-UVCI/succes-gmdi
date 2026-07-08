import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-ok" [class.show]="visible()" [class.alert-error]="type() === 'error'">
      <i class="ti" [class.ti-check]="type() !== 'error'" [class.ti-alert-circle]="type() === 'error'"></i>
      <span>{{ message() }}</span>
    </div>
  `
})
export class ToastComponent {
  visible = input<boolean>(false);
  message = input<string>('');
  type = input<'success' | 'error'>('success');
}
