import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  ActualiteApi, ActualiteCreateRequest,
  CompteReseauApi, PostProgrammeApi,
  PartenaireApi, PartenaireCreateRequest, ArticlePresseApi,
  DocumentApi, DocumentCreateRequest,
  ReclamationApi, ReclamationCreateRequest,
  SuggestionApi, SuggestionCreateRequest,
  ConsultationApi, ConsultationCreateRequest,
  CampagneSmsApi, CampagneSmsCreateRequest, AlerteRequest,
  StatsCommunicationApi,
  PaginatedResponse, ApiResponse
} from '../models/api.models';

const B = () => `${environment.apiUrl}/com`;

// ── Actualités ────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ActualiteApiService {
  private http = inject(HttpClient);
  private base = `${B()}/actualites`;

  getAll(f: { type?: string; statut?: string; search?: string; page?: number } = {}): Observable<PaginatedResponse<ActualiteApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v !== undefined && v !== '') p = p.set(k, String(v)); });
    return this.http.get<PaginatedResponse<ActualiteApi>>(this.base, { params: p });
  }
  create(data: ActualiteCreateRequest): Observable<ApiResponse<ActualiteApi>> {
    return this.http.post<ApiResponse<ActualiteApi>>(this.base, data);
  }
  update(id: number, data: ActualiteCreateRequest): Observable<ApiResponse<ActualiteApi>> {
    return this.http.put<ApiResponse<ActualiteApi>>(`${this.base}/${id}`, data);
  }
  updateStatut(id: number, statut: string): Observable<ApiResponse<ActualiteApi>> {
    return this.http.patch<ApiResponse<ActualiteApi>>(`${this.base}/${id}/statut`, { statut });
  }
  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.base}/${id}`);
  }
}

// ── Réseaux sociaux ───────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ReseauxApiService {
  private http = inject(HttpClient);

  getComptes(): Observable<CompteReseauApi[]> {
    return this.http.get<CompteReseauApi[]>(`${B()}/reseaux/comptes`);
  }
  getCalendrier(): Observable<PostProgrammeApi[]> {
    return this.http.get<PostProgrammeApi[]>(`${B()}/reseaux/calendrier`);
  }
  publierPost(data: { contenu: string; plateformes: string[]; programme?: boolean; date?: string }): Observable<ApiResponse<PostProgrammeApi>> {
    return this.http.post<ApiResponse<PostProgrammeApi>>(`${B()}/reseaux/publier`, data);
  }
  ajouterCalendrier(data: { date: string; contenu: string; plateformes: string[]; responsable: string }): Observable<ApiResponse<PostProgrammeApi>> {
    return this.http.post<ApiResponse<PostProgrammeApi>>(`${B()}/reseaux/calendrier`, data);
  }
}

// ── Relations publiques ───────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class RelationsApiService {
  private http = inject(HttpClient);

  getPartenaires(): Observable<PaginatedResponse<PartenaireApi>> {
    return this.http.get<PaginatedResponse<PartenaireApi>>(`${B()}/relations/partenaires`);
  }
  createPartenaire(data: PartenaireCreateRequest): Observable<ApiResponse<PartenaireApi>> {
    return this.http.post<ApiResponse<PartenaireApi>>(`${B()}/relations/partenaires`, data);
  }
  getRevuePresse(): Observable<ArticlePresseApi[]> {
    return this.http.get<ArticlePresseApi[]>(`${B()}/relations/presse`);
  }
  envoyerDossierPresse(data: { titre: string; medias: string; date_envoi: string; contact: string }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${B()}/relations/presse/envoyer`, data);
  }
  getMedias(): Observable<ArticlePresseApi[]> {
    return this.http.get<ArticlePresseApi[]>(`${B()}/relations/medias`);
  }
}

// ── Documents ─────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class DocumentApiService {
  private http = inject(HttpClient);
  private base = `${B()}/documents`;

  getAll(f: { type?: string; search?: string } = {}): Observable<PaginatedResponse<DocumentApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, v); });
    return this.http.get<PaginatedResponse<DocumentApi>>(this.base, { params: p });
  }
  getByType(type: string): Observable<DocumentApi[]> {
    return this.http.get<DocumentApi[]>(`${this.base}/type/${type}`);
  }
  create(data: DocumentCreateRequest): Observable<ApiResponse<DocumentApi>> {
    return this.http.post<ApiResponse<DocumentApi>>(this.base, data);
  }
  createPhotos(formData: FormData): Observable<ApiResponse<DocumentApi[]>> {
    return this.http.post<ApiResponse<DocumentApi[]>>(this.base, formData);
  }
}

// ── Réclamations ──────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ReclamationApiService {
  private http = inject(HttpClient);
  private base = `${B()}/citoyens/reclamations`;

  getAll(f: { statut?: string; service?: string } = {}): Observable<PaginatedResponse<ReclamationApi>> {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p = p.set(k, v); });
    return this.http.get<PaginatedResponse<ReclamationApi>>(this.base, { params: p });
  }
  create(data: ReclamationCreateRequest): Observable<ApiResponse<ReclamationApi>> {
    return this.http.post<ApiResponse<ReclamationApi>>(this.base, data);
  }
  updateStatut(id: number, statut: string): Observable<ApiResponse<ReclamationApi>> {
    return this.http.patch<ApiResponse<ReclamationApi>>(`${this.base}/${id}/statut`, { statut });
  }
  export(): Observable<Blob> {
    return this.http.get(`${this.base}/export`, { responseType: 'blob' });
  }
}

// ── Suggestions ───────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class SuggestionApiService {
  private http = inject(HttpClient);
  private base = `${B()}/citoyens/suggestions`;

  getAll(f: { statut?: string } = {}): Observable<PaginatedResponse<SuggestionApi>> {
    let p = new HttpParams();
    if (f.statut) p = p.set('statut', f.statut);
    return this.http.get<PaginatedResponse<SuggestionApi>>(this.base, { params: p });
  }
  create(data: SuggestionCreateRequest): Observable<ApiResponse<SuggestionApi>> {
    return this.http.post<ApiResponse<SuggestionApi>>(this.base, data);
  }
  transmettre(id: number): Observable<ApiResponse<SuggestionApi>> {
    return this.http.patch<ApiResponse<SuggestionApi>>(`${this.base}/${id}/transmettre`, {});
  }
}

// ── Consultations ─────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ConsultationApiService {
  private http = inject(HttpClient);
  private base = `${B()}/citoyens/consultations`;

  getAll(): Observable<ConsultationApi[]> {
    return this.http.get<ConsultationApi[]>(this.base);
  }
  create(data: ConsultationCreateRequest): Observable<ApiResponse<ConsultationApi>> {
    return this.http.post<ApiResponse<ConsultationApi>>(this.base, data);
  }
}

// ── SMS ───────────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class SmsApiService {
  private http = inject(HttpClient);

  getHistorique(): Observable<CampagneSmsApi[]> {
    return this.http.get<CampagneSmsApi[]>(`${B()}/sms/historique`);
  }
  lancerCampagne(data: CampagneSmsCreateRequest): Observable<ApiResponse<CampagneSmsApi>> {
    return this.http.post<ApiResponse<CampagneSmsApi>>(`${B()}/sms/campagne`, data);
  }
  envoyerAlerte(data: AlerteRequest): Observable<ApiResponse<CampagneSmsApi>> {
    return this.http.post<ApiResponse<CampagneSmsApi>>(`${B()}/sms/alerte`, data);
  }
  export(): Observable<Blob> {
    return this.http.get(`${B()}/sms/export`, { responseType: 'blob' });
  }
}

// ── Statistiques ──────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class StatsCommunicationApiService {
  private http = inject(HttpClient);
  getDashboard(): Observable<StatsCommunicationApi> {
    return this.http.get<StatsCommunicationApi>(`${B()}/statistiques`);
  }
}
