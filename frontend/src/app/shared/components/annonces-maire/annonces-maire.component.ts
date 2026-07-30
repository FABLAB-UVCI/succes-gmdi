import { Component, inject, signal, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

export interface AnnonceMaire {
  id: number;
  titre: string;
  contenu: string;
  auteur: string | null;
  date: string;
  urgent: boolean;
  audience: string;
}

/**
 * Widget "Annonces du Maire" — affiché dans la sidebar de tous les modules E-Mairie.
 * Composant partagé pour éviter la duplication entre modules (voir communication-shell,
 * son implémentation d'origine).
 *
 * Les annonces sont lues depuis /api/public/annonces (voir PublicAnnoncesController),
 * alimentées par les publications de type "annonce" créées par le Maire — dès qu'une
 * nouvelle annonce est publiée, ce widget la reflète au prochain chargement du module.
 */
@Component({
  selector: 'app-annonces-maire',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="sb-maire-block">
  <div class="sb-maire-header">
    <div class="sb-maire-flag">
      <span class="flag-o"></span><span class="flag-w"></span><span class="flag-v"></span>
    </div>
    <div class="sb-maire-title">
      <i class="ti ti-speakerphone"></i>
      Annonces du Maire
    </div>
  </div>
  <div class="sb-maire-scroll">
    @if (loading()) {
      <div class="ann-empty">Chargement…</div>
    } @else if (annonces().length === 0) {
      <div class="ann-empty">Aucune annonce pour le moment.</div>
    } @else {
      @for (ann of annonces().slice(0, 4); track ann.id) {
        <div class="sb-ann-item" [class.ann-urgent]="ann.urgent">
          <div class="ann-dot" [class.ann-dot-urgent]="ann.urgent"></div>
          <div class="ann-content">
            <div class="ann-titre">{{ann.titre}}</div>
            <div class="ann-date">{{ann.date | date:'dd MMMM yyyy':'':'fr-FR'}}</div>
          </div>
        </div>
      }
    }
  </div>
  <div class="sb-maire-footer" (click)="showAll.set(true)" role="button">
    <i class="ti ti-chevron-right"></i> Voir toutes les annonces
  </div>
</div>

@if (showAll()) {
  <div class="ann-modal-overlay" (click)="showAll.set(false)">
    <div class="ann-modal" (click)="$event.stopPropagation()">
      <div class="ann-modal-header">
        <h3><i class="ti ti-speakerphone"></i> Toutes les annonces du Maire</h3>
        <button class="ann-modal-close" (click)="showAll.set(false)"><i class="ti ti-x"></i></button>
      </div>
      <div class="ann-modal-body">
        @if (annonces().length === 0) {
          <div class="ann-empty" style="color:#64748b;padding:2rem;">Aucune annonce publiée pour le moment.</div>
        } @else {
          @for (ann of annonces(); track ann.id) {
            <div class="ann-full-item" [class.ann-full-urgent]="ann.urgent">
              <div class="ann-full-head">
                <span class="ann-full-titre">{{ann.titre}}</span>
                @if (ann.urgent) { <span class="ann-full-badge">Urgent</span> }
              </div>
              <p class="ann-full-contenu">{{ann.contenu}}</p>
              <div class="ann-full-meta">{{ann.date | date:'dd MMMM yyyy':'':'fr-FR'}} @if (ann.auteur) { — {{ann.auteur}} }</div>
            </div>
          }
        }
      </div>
    </div>
  </div>
}
  `,
  styles: [`
    .sb-maire-block { margin:20px 10px 10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);display:flex;flex-direction:column;flex-shrink:0; }
    .sb-maire-header{ display:flex;align-items:center;gap:8px;padding:10px 12px 6px;flex-shrink:0; }
    .sb-maire-flag  { display:flex;height:22px;border-radius:3px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.3); }
    .sb-maire-flag span { display:block;width:7px; }
    .flag-o { background:#F77F00; }
    .flag-w { background:#fff; }
    .flag-v { background:#009A44; }
    .sb-maire-title { color:rgba(255,255,255,.8);font-size:11px;font-weight:700;display:flex;align-items:center;gap:5px;letter-spacing:.3px; }
    .sb-maire-title i { color:#F77F00; }
    .sb-maire-scroll{ padding:4px 12px;display:flex;flex-direction:column;gap:6px;max-height:none;overflow-y:visible; }
    .sb-ann-item    { display:flex;align-items:flex-start;gap:8px;padding:6px 0; }
    .ann-dot        { width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3);margin-top:4px;flex-shrink:0; }
    .ann-dot-urgent { background:#e63946; }
    .ann-content    { flex:1; }
    .ann-titre      { font-size:11px;color:rgba(255,255,255,.75);font-weight:500;line-height:1.3; }
    .ann-date       { font-size:10px;color:rgba(255,255,255,.35);margin-top:2px; }
    .ann-urgent .ann-titre { color:#fbbf24; }
    .ann-empty      { font-size:11px;color:rgba(255,255,255,.4);padding:6px 0;font-style:italic; }
    .sb-maire-footer{ text-align:center;font-size:10px;color:rgba(255,255,255,.35);padding:6px 12px 10px;cursor:pointer;transition:color .15s;display:flex;align-items:center;justify-content:center;gap:4px;flex-shrink:0; }
    .sb-maire-footer:hover { color:rgba(255,255,255,.6); }

    .ann-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(2px); }
    .ann-modal { background: #fff; width: 560px; max-width: 92vw; border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,.25); overflow: hidden; max-height: 85vh; display: flex; flex-direction: column; }
    .ann-modal-header { padding: 1.1rem 1.5rem; background: linear-gradient(135deg, #003366, #004fa3); color: white; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
    .ann-modal-header h3 { margin: 0; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
    .ann-modal-close { background: rgba(255,255,255,.15); border: none; color: white; font-size: 1rem; cursor: pointer; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
    .ann-modal-close:hover { background: rgba(255,255,255,.3); }
    .ann-modal-body { padding: 1.2rem 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
    .ann-full-item { padding: 1rem; border-radius: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #009A44; }
    .ann-full-urgent { border-left-color: #e63946; background: #fff8f0; }
    .ann-full-head { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .4rem; }
    .ann-full-titre { font-weight: 700; color: #003366; font-size: .95rem; }
    .ann-full-badge { background: #e63946; color: #fff; font-size: .68rem; font-weight: 700; padding: .15rem .5rem; border-radius: 20px; text-transform: uppercase; }
    .ann-full-contenu { color: #334155; font-size: .85rem; margin: 0 0 .5rem; line-height: 1.5; white-space: pre-line; }
    .ann-full-meta { font-size: .75rem; color: #94a3b8; }
  `]
})
export class AnnoncesMaireComponent implements OnInit {
  /** Slug du module qui embarque ce widget (ex: 'finances', 'etat-civil'). */
  @Input() moduleKey?: string;

  private http = inject(HttpClient);
  private base = environment.apiUrl;

  annonces = signal<AnnonceMaire[]>([]);
  loading  = signal(true);
  showAll  = signal(false);

  ngOnInit(): void {
    const url = this.moduleKey ? `${this.base}/public/annonces?module=${this.moduleKey}` : `${this.base}/public/annonces`;
    this.http.get<{ data: AnnonceMaire[] }>(url).subscribe({
      next:  r => { this.annonces.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
