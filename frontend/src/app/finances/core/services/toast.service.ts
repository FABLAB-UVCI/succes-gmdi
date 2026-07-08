// src/app/core/services/toast.service.ts
import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  visible: boolean;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, duration = 3500): void {
    this.push(message, 'success', duration);
  }

  showError(message: string, duration = 5000): void {
    this.push(message, 'error', duration);
  }

  private push(message: string, type: 'success' | 'error', duration: number): void {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    this.toasts.update(t => [...t, { id, message, visible: true, type }]);
    setTimeout(() => {
      this.toasts.update(t => t.filter(x => x.id !== id));
    }, duration);
  }
}
