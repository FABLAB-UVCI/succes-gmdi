import { Injectable, signal } from '@angular/core';
export interface Toast { id: string; message: string; title?: string; visible: boolean; type: 'success'|'error'; }
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Record<string, Toast>>({});
  show(id: string, message: string): void { this._push(id, message, undefined, 'success'); }
  showError(id: string, message: string, title?: string): void { this._push(id, message, title, 'error'); }
  get(id: string): Toast|undefined { return this.toasts()[id]; }
  private _push(id: string, message: string, title: string|undefined, type: Toast['type']): void {
    this.toasts.update(t => ({ ...t, [id]: { id, message, title, visible: true, type } }));
    setTimeout(() => this.toasts.update(t => { const c={...t}; if(c[id]) c[id]={...c[id],visible:false}; return c; }), type==='error'?5000:3000);
  }
}
