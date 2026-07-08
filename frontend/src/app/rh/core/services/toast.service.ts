import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  visible: boolean;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Record<string, Toast>>({});

  show(id: string, message: string, type: 'success' | 'error' = 'success'): void {
    this.toasts.update(t => ({ ...t, [id]: { id, message, visible: true, type } }));
    setTimeout(() => {
      this.toasts.update(t => {
        const copy = { ...t };
        if (copy[id]) copy[id] = { ...copy[id], visible: false };
        return copy;
      });
    }, type === 'error' ? 5000 : 3500);
  }

  showError(id: string, message: string): void {
    this.show(id, message, 'error');
  }

  get(id: string): Toast | undefined {
    return this.toasts()[id];
  }
}
