import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-ok" [class.show]="visible()">
      <i class="ti ti-check"></i>
      <span>{{ message() }}</span>
    </div>
  `
})
export class ToastComponent {
  visible = input<boolean>(false);
  message = input<string>('');
}
