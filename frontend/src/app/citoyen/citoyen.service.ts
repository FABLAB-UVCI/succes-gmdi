import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface Demarche {
  id: number;
  reference: string;
  module: string;
  type_demarche: string | null;
  statut: string;
  donnees?: any;
  created_at: string;
  updated_at: string;
}

export interface DemarcheCreateRequest {
  module: string;
  type_demarche?: string;
  donnees?: any;
}

const STATUT_LABELS: Record<string, string> = {
  en_attente:  'En attente',
  en_cours:    'En cours',
  a_completer: 'À compléter',
  valide:      'Validé',
  refuse:      'Refusé',
  termine:     'Terminé',
};

const STATUT_COLORS: Record<string, string> = {
  en_attente:  '#F77F00',
  en_cours:    '#003366',
  a_completer: '#e63946',
  valide:      '#009A44',
  refuse:      '#e63946',
  termine:     '#7a5c3a',
};

@Injectable({ providedIn: 'root' })
export class CitoyenService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}`;

  getDemarches(): Observable<{ data: Demarche[] }> {
    return this.http.get<{ data: Demarche[] }>(`${this.base}/demarches`);
  }

  createDemarche(payload: DemarcheCreateRequest | FormData): Observable<{ success: boolean; message: string; data: Demarche }> {
    return this.http.post<{ success: boolean; message: string; data: Demarche }>(`${this.base}/demarches`, payload);
  }

  labelForStatut(statut: string): string {
    return STATUT_LABELS[statut] ?? statut;
  }

  colorForStatut(statut: string): string {
    return STATUT_COLORS[statut] ?? '#7a5c3a';
  }
}
