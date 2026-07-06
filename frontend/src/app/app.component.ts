import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './communication/core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
<router-outlet />

<!-- ── Toasts erreur globaux ──────────────────────────────────────────────── -->
<div class="toast-stack">
  @for (t of errorToasts(); track t.id) {
    @if (t.visible) {
      <div class="toast-err">
        <i class="ti ti-alert-circle"></i>
        <div>
          <div class="toast-err-title">{{t.title}}</div>
          <div class="toast-err-msg">{{t.message}}</div>
        </div>
      </div>
    }
  }
</div>

<style>
.toast-stack {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;
  pointer-events: none;
}
.toast-err {
  background: #fff;
  border: .5px solid #f5c6c6;
  border-left: 4px solid #e63946;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: 'Inter', system-ui, sans-serif;
  box-shadow: 0 4px 20px rgba(0,0,0,.12);
  min-width: 260px;
  max-width: 360px;
  animation: slideIn .2s ease;
}
.toast-err i { color: #e63946; font-size: 16px; margin-top: 1px; flex-shrink: 0; }
.toast-err-title { font-size: 12px; font-weight: 600; color: #111827; }
.toast-err-msg   { font-size: 11px; color: #6b7280; margin-top: 2px; }
@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
</style>
  `
})
export class AppComponent {
  private toast = inject(ToastService);

  errorToasts = computed(() => Object.values(this.toast.toasts()).filter(t => t.type === 'error'));
}
