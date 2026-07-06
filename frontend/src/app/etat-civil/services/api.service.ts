import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Naissances
  getNaissances(search = '') {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<any[]>(`${API}/naissances`, { params });
  }
  createNaissance(data: any) {
    return this.http.post<any>(`${API}/naissances`, data);
  }
  deleteNaissance(id: number) {
    return this.http.delete(`${API}/naissances/${id}`);
  }

  // Mariages
  getMariages(search = '') {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<any[]>(`${API}/mariages`, { params });
  }
  createMariage(data: any) {
    return this.http.post<any>(`${API}/mariages`, data);
  }
  deleteMariage(id: number) {
    return this.http.delete(`${API}/mariages/${id}`);
  }

  // Décès
  getDeces(search = '') {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<any[]>(`${API}/deces`, { params });
  }
  createDeces(data: any) {
    return this.http.post<any>(`${API}/deces`, data);
  }
  deleteDeces(id: number) {
    return this.http.delete(`${API}/deces/${id}`);
  }

  // Certificats
  getCertificats(search = '') {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<any[]>(`${API}/certificats`, { params });
  }
  createCertificat(data: any) {
    return this.http.post<any>(`${API}/certificats`, data);
  }
  deleteCertificat(id: number) {
    return this.http.delete(`${API}/certificats/${id}`);
  }

  // Statistiques
  getStatistiques() {
    return this.http.get<any>(`${API}/statistiques`);
  }
}
