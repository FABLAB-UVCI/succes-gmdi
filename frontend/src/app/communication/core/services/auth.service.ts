import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { LoginRequest, LoginResponse, RegisterRequest, UserApi, UpdateProfileRequest, ChangePasswordRequest } from '../models/api.models';
const TK='E-Mairie_token', UK='E-Mairie_user';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http=inject(HttpClient); private router=inject(Router);
  private _token=signal<string|null>(localStorage.getItem(TK));
  private _user=signal<UserApi|null>(this._load());
  readonly isAuthenticated=computed(()=>!!this._token());
  readonly currentUser=computed(()=>this._user());
  readonly token=computed(()=>this._token());
  login(c:LoginRequest){
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`,c).pipe(
      tap(r=>{localStorage.setItem(TK,r.token);localStorage.setItem(UK,JSON.stringify(r.user));this._token.set(r.token);this._user.set(r.user);}),
      catchError(e=>throwError(()=>new Error(e.error?.message??'Identifiants incorrects')))
    );
  }
  register(c:RegisterRequest){
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register`,c).pipe(
      tap(r=>{localStorage.setItem(TK,r.token);localStorage.setItem(UK,JSON.stringify(r.user));this._token.set(r.token);this._user.set(r.user);}),
      catchError(e=>throwError(()=>new Error(e.error?.message??"Impossible de créer le compte.")))
    );
  }
  updateProfile(c:UpdateProfileRequest){
    return this.http.put<{message:string;user:UserApi}>(`${environment.apiUrl}/auth/profile`,c).pipe(
      tap(r=>{localStorage.setItem(UK,JSON.stringify(r.user));this._user.set(r.user);}),
      catchError(e=>throwError(()=>new Error(e.error?.message??'Impossible de mettre à jour le profil.')))
    );
  }
  changePassword(c:ChangePasswordRequest){
    return this.http.put<{message:string}>(`${environment.apiUrl}/auth/change-password`,c).pipe(
      catchError(e=>throwError(()=>new Error(e.error?.message??'Impossible de changer le mot de passe.')))
    );
  }
  logout():void{this.http.post(`${environment.apiUrl}/auth/logout`,{}).subscribe({complete:()=>this._clear(),error:()=>this._clear()});}
  /** Reste connecte, revient juste au selecteur de modules. */
  backToModules():void{this.router.navigate([this._user()?.role==='maire'?'/maire':'/accueil']);}
  refreshToken(){return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`,{}).pipe(tap(r=>{localStorage.setItem(TK,r.token);this._token.set(r.token);}));}
  private _clear():void{localStorage.removeItem(TK);localStorage.removeItem(UK);this._token.set(null);this._user.set(null);this.router.navigate(['/']);}
  private _load():UserApi|null{try{const r=localStorage.getItem(UK);return r?JSON.parse(r):null;}catch{return null;}}
}

