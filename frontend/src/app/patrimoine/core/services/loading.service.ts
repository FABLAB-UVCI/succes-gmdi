import { Injectable, signal, computed } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _c = signal(0);
  readonly isLoading = computed(() => this._c() > 0);
  increment(): void { this._c.update(n => n + 1); }
  decrement(): void { this._c.update(n => Math.max(0, n - 1)); }
}
