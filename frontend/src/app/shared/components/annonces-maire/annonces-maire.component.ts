import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Widget "Annonces du Maire" — affiché dans la sidebar de tous les modules GMDI.
 * Composant partagé pour éviter la duplication entre modules (voir communication-shell,
 * son implémentation d'origine).
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
    @for (ann of annonces; track ann.id) {
      <div class="sb-ann-item" [class.ann-urgent]="ann.urgent">
        <div class="ann-dot" [class.ann-dot-urgent]="ann.urgent"></div>
        <div class="ann-content">
          <div class="ann-titre">{{ann.titre}}</div>
          <div class="ann-date">{{ann.date}}</div>
        </div>
      </div>
    }
  </div>
  <div class="sb-maire-footer">
    <i class="ti ti-chevron-right"></i> Voir toutes les annonces
  </div>
</div>
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
    .sb-maire-footer{ text-align:center;font-size:10px;color:rgba(255,255,255,.35);padding:6px 12px 10px;cursor:pointer;transition:color .15s;display:flex;align-items:center;justify-content:center;gap:4px;flex-shrink:0; }
    .sb-maire-footer:hover { color:rgba(255,255,255,.6); }
  `]
})
export class AnnoncesMaireComponent {
  annonces = [
    { id: 1, titre: 'Inauguration du nouveau marché d\'Adjamé', date: '24 juin 2026', urgent: true },
    { id: 2, titre: 'Journée de vaccination gratuite — Treichville', date: '26 juin 2026', urgent: false },
    { id: 3, titre: 'Réunion communautaire — Plateau Centre', date: '28 juin 2026', urgent: false },
    { id: 4, titre: 'Fête nationale : coupure d\'eau programmée', date: '07 août 2026', urgent: true },
  ];
}
