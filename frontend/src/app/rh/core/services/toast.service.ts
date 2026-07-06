import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Record<string, Toast>>({});

  show(id: string, message: string): void {
    this.toasts.update(t => ({ ...t, [id]: { id, message, visible: true } }));
    setTimeout(() => {
      this.toasts.update(t => {
        const copy = { ...t };
        if (copy[id]) copy[id] = { ...copy[id], visible: false };
        return copy;
      });
    }, 3500);
  }

  get(id: string): Toast | undefined {
    return this.toasts()[id];
  }
}
