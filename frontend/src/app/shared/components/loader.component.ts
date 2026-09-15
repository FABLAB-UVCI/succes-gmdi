import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <i class="ti ti-loader-2 gmdi-loader" [style.fontSize]="size === 'md' ? '16px' : '13px'"></i>
  `,
  styles: [`
    .gmdi-loader {
      animation: spin 1s linear infinite;
      display: inline-block;
      vertical-align: middle;
      color: var(--ci-orange, #F77F00);
      opacity: .7;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoaderComponent {
  @Input() size: 'sm' | 'md' = 'sm';
}
