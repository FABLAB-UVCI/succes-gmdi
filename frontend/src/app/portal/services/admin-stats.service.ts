import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AdminStats {
  citoyens: number;
  demarches: {
    total: number;
    en_attente: number;
    en_cours: number;
    valide: number;
    refuse: number;
  };
  modules: Record<string, number>;
  recentes: any[];
  agents: number;
  revenus: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminStatsService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getStats(): Observable<AdminStats> {
    return this.http.get<{ data: AdminStats }>(`${this.base}/admin/statistiques`)
      .pipe(map(res => res.data));
  }
}
