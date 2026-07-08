import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrbanismeService } from '../../../../core/services/urbanisme.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'carte' | 'quartiers' | 'voiries' | 'reseaux';

@Component({
  selector: 'app-cartographie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="tabs">
  @for (t of tabs; track t.id) {
    <div class="tab" [class.act]="active()===t.id" (click)="active.set(t.id)">
      <i class="ti {{t.icon}}"></i>{{t.label}}
    </div>
  }
</div>
<div class="panel notop">

<!-- ── Carte communale ────────────────────────────────────────────────── -->
@if (active()==='carte') {
  <div class="ph">
    <div class="pt"><i class="ti ti-map"></i>Carte communale SIG</div>
    <div style="display:flex;gap:8px">
      <select class="fs" style="max-width:150px" [(ngModel)]="coucheActive">
        <option value="all">Toutes les couches</option>
        <option value="quartiers">Quartiers</option>
        <option value="voiries">Voiries</option>
        <option value="electricite">Réseau électrique</option>
        <option value="hydraulique">Réseau hydraulique</option>
        <option value="equipements">Équipements publics</option>
      </select>
    </div>
  </div>

  <!-- Carte placeholder avec couches visuelles ─────────────────────────── -->
  <div class="sig-map">
    <div class="sig-bg">
      <div class="sig-grid"></div>

      <!-- Quartiers représentés ──────────────────────────────────────── -->
      @if (coucheActive==='all' || coucheActive==='quartiers') {
        <div class="sig-zone" style="left:10%;top:15%;width:30%;height:25%;background:rgba(139,92,246,.12);border:1.5px solid rgba(139,92,246,.4)">
          <span class="sig-label">Plateau</span>
        </div>
        <div class="sig-zone" style="left:42%;top:15%;width:28%;height:22%;background:rgba(139,92,246,.1);border:1.5px solid rgba(139,92,246,.35)">
          <span class="sig-label">Cocody</span>
        </div>
        <div class="sig-zone" style="left:10%;top:42%;width:35%;height:28%;background:rgba(139,92,246,.08);border:1.5px solid rgba(139,92,246,.3)">
          <span class="sig-label">Yopougon</span>
        </div>
        <div class="sig-zone" style="left:47%;top:40%;width:30%;height:30%;background:rgba(139,92,246,.1);border:1.5px solid rgba(139,92,246,.3)">
          <span class="sig-label">Adjamé</span>
        </div>
      }

      <!-- Voiries ──────────────────────────────────────────────────── -->
      @if (coucheActive==='all' || coucheActive==='voiries') {
        <div style="position:absolute;left:8%;top:35%;width:75%;height:2px;background:#F77F00;opacity:.6"></div>
        <div style="position:absolute;left:40%;top:12%;width:2px;height:72%;background:#F77F00;opacity:.5"></div>
        <div style="position:absolute;left:25%;top:20%;width:2px;height:55%;background:#aaa;opacity:.4"></div>
      }

      <!-- Équipements ──────────────────────────────────────────────── -->
      @if (coucheActive==='all' || coucheActive==='equipements') {
        <div class="sig-pin" style="left:18%;top:22%" title="École Primaire Centre"><i class="ti ti-school"></i></div>
        <div class="sig-pin" style="left:55%;top:18%" title="Centre de Santé"><i class="ti ti-heart-rate-monitor" style="color:#e63946"></i></div>
        <div class="sig-pin" style="left:35%;top:55%" title="Marché Municipal" ><i class="ti ti-shopping-cart" style="color:#F77F00"></i></div>
        <div class="sig-pin" style="left:62%;top:52%" title="Espace Vert"><i class="ti ti-trees" style="color:#009A44"></i></div>
        <div class="sig-pin" style="left:78%;top:30%" title="École Secondaire"><i class="ti ti-school"></i></div>
      }

      <!-- Légende ──────────────────────────────────────────────────── -->
      <div class="sig-legend">
        <div class="sig-leg-item"><span style="background:rgba(139,92,246,.25);border:1px solid #8B5CF6;display:inline-block;width:14px;height:10px;margin-right:4px;border-radius:2px"></span>Quartiers</div>
        <div class="sig-leg-item"><span style="background:#F77F00;display:inline-block;width:14px;height:3px;margin-right:4px;vertical-align:middle"></span>Voiries</div>
        <div class="sig-leg-item"><i class="ti ti-school" style="color:#8B5CF6;font-size:13px;margin-right:4px"></i>Écoles</div>
        <div class="sig-leg-item"><i class="ti ti-heart-rate-monitor" style="color:#e63946;font-size:13px;margin-right:4px"></i>Santé</div>
        <div class="sig-leg-item"><i class="ti ti-shopping-cart" style="color:#F77F00;font-size:13px;margin-right:4px"></i>Marchés</div>
        <div class="sig-leg-item"><i class="ti ti-trees" style="color:#009A44;font-size:13px;margin-right:4px"></i>Espaces verts</div>
      </div>

      <div style="position:absolute;bottom:8px;right:8px;font-size:10px;color:#999">
        GMDI SIG — Commune d'Abidjan
      </div>
    </div>
  </div>

  <!-- Stats couches ────────────────────────────────────────────────────── -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:.75rem 1rem">
    <div class="mini-kpi"><span class="mk-v" style="color:#8B5CF6">{{urb.quartiers().length}}</span><span class="mk-l">Quartiers</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#F77F00">{{urb.voiries().length}}</span><span class="mk-l">Axes voirie</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#185FA5">{{urb.reseauxElec().length}}</span><span class="mk-l">Zones électriques</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#009A44">{{urb.reseauxHydro().length}}</span><span class="mk-l">Zones hydrauliques</span></div>
  </div>
}

<!-- ── Quartiers ──────────────────────────────────────────────────────── -->
@if (active()==='quartiers') {
  <div class="ph">
    <div class="pt"><i class="ti ti-map-pin"></i>Quartiers de la commune</div>
    <button class="btn-s" (click)="showAddQ.set(!showAddQ())"><i class="ti ti-plus"></i>Nouveau quartier</button>
  </div>
  @if (showAddQ()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Nom du quartier</div><input class="fi" [(ngModel)]="fQ.nom" placeholder="Ex: Cocody Riviera"></div>
        <div class="fg"><div class="fl">Code</div><input class="fi" [(ngModel)]="fQ.code" placeholder="Ex: COC-RIV"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Superficie (ha)</div><input class="fi" type="number" [(ngModel)]="fQ.superficie"></div>
        <div class="fg"><div class="fl">Population estimée</div><input class="fi" type="number" [(ngModel)]="fQ.population"></div>
        <div class="fg"><div class="fl">Chef de quartier</div><input class="fi" [(ngModel)]="fQ.chef"></div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddQ.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" (click)="ajouterQuartier()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Code</th><th>Nom</th><th>Superficie</th><th>Population</th><th>Chef de quartier</th><th>Parcelles</th></tr></thead>
      <tbody>
        @for (q of urb.quartiers(); track q.id) {
          <tr>
            <td class="mono-td">{{q.code}}</td>
            <td style="font-weight:500">{{q.nom}}</td>
            <td>{{q.superficie | number}} ha</td>
            <td>{{q.population ? (q.population | number) : '—'}} hab.</td>
            <td>{{q.chef || '—'}}</td>
            <td>{{q.nombreParcelles ?? '—'}}</td>
          </tr>
        }
        @empty { <tr><td colspan="6" class="empty-row">Aucun quartier enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Voiries SIG ─────────────────────────────────────────────────────── -->
@if (active()==='voiries') {
  <div class="ph">
    <div class="pt"><i class="ti ti-road"></i>Réseau de voiries (couche SIG)</div>
    <button class="btn-s" (click)="showAddV.set(!showAddV())"><i class="ti ti-plus"></i>Ajouter</button>
  </div>
  @if (showAddV()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Nom de la voie</div><input class="fi" [(ngModel)]="fV.nom" placeholder="Ex: Boulevard Lagunaire"></div>
        <div class="fg"><div class="fl">Quartier</div><input class="fi" [(ngModel)]="fV.quartier"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Type</div>
          <select class="fs" [(ngModel)]="fV.type">
            <option value="principale">Principale</option><option value="secondaire">Secondaire</option><option value="piste">Piste</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Longueur (km)</div><input class="fi" type="number" [(ngModel)]="fV.longueur"></div>
        <div class="fg"><div class="fl">État</div>
          <select class="fs" [(ngModel)]="fV.etat">
            <option value="bon">Bon</option><option value="moyen">Moyen</option><option value="degrade">Dégradé</option>
          </select>
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddV.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" (click)="ajouterVoirie()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Nom</th><th>Quartier</th><th>Type</th><th>Longueur</th><th>État</th></tr></thead>
      <tbody>
        @for (v of urb.voiries(); track v.id) {
          <tr>
            <td style="font-weight:500">{{v.nom}}</td>
            <td>{{v.quartier}}</td>
            <td><span class="chip cm">{{v.type}}</span></td>
            <td>{{v.longueur | number:'1.1-1'}} km</td>
            <td><span class="chip" [ngClass]="chipEtat(v.etat??v.statut)">{{v.etat??v.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="5" class="empty-row">Aucune voirie enregistrée</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Réseaux ──────────────────────────────────────────────────────────── -->
@if (active()==='reseaux') {
  <div class="ph"><div class="pt"><i class="ti ti-topology-star"></i>Réseaux techniques</div></div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:1rem">

    <!-- Réseau électrique ────────────────────────────────────────────── -->
    <div>
      <div style="font-size:12px;font-weight:500;margin-bottom:8px;display:flex;align-items:center;gap:6px;color:#185FA5">
        <i class="ti ti-bolt"></i>Réseau électrique
      </div>
      <div style="border:.5px solid var(--color-border-tertiary);border-radius:6px;overflow:hidden">
        <table>
          <thead><tr><th>Zone</th><th>Type</th><th>Longueur</th><th>Couverture</th><th>Opérateur</th></tr></thead>
          <tbody>
            @for (r of urb.reseauxElec(); track r.id) {
              <tr>
                <td style="font-weight:500">{{r.zone}}</td>
                <td><span class="chip" [ngClass]="chipHT(r.type)">{{r.type}}</span></td>
                <td>{{r.longueur | number:'1.1-1'}} km</td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px">
                    <div style="flex:1;height:4px;background:#e5e7eb;border-radius:2px">
                      <div style="height:4px;border-radius:2px;background:#185FA5" [style.width.%]="r.tauxCouverture"></div>
                    </div>
                    <span style="font-size:11px;font-weight:500">{{r.tauxCouverture}}%</span>
                  </div>
                </td>
                <td>{{r.operateur}}</td>
              </tr>
            }
            @empty { <tr><td colspan="5" class="empty-row">Aucune donnée</td></tr> }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Réseau hydraulique ───────────────────────────────────────────── -->
    <div>
      <div style="font-size:12px;font-weight:500;margin-bottom:8px;display:flex;align-items:center;gap:6px;color:#009A44">
        <i class="ti ti-droplet"></i>Réseau hydraulique
      </div>
      <div style="border:.5px solid var(--color-border-tertiary);border-radius:6px;overflow:hidden">
        <table>
          <thead><tr><th>Zone</th><th>Type</th><th>Longueur</th><th>Couverture</th><th>Statut</th></tr></thead>
          <tbody>
            @for (r of urb.reseauxHydro(); track r.id) {
              <tr>
                <td style="font-weight:500">{{r.zone}}</td>
                <td><span class="chip cm">{{r.type}}</span></td>
                <td>{{r.longueur | number:'1.1-1'}} km</td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px">
                    <div style="flex:1;height:4px;background:#e5e7eb;border-radius:2px">
                      <div style="height:4px;border-radius:2px;background:#009A44" [style.width.%]="r.tauxCouverture"></div>
                    </div>
                    <span style="font-size:11px;font-weight:500">{{r.tauxCouverture}}%</span>
                  </div>
                </td>
                <td><span class="chip" [ngClass]="chipReseau(r.statut)">{{r.statut}}</span></td>
              </tr>
            }
            @empty { <tr><td colspan="5" class="empty-row">Aucune donnée</td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  </div>
}
@if (toast.get('sig')?.visible) {
  <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('sig')?.message}}</div>
}
</div>
  `
})
export class CartographieComponent implements OnInit {
  readonly urb   = inject(UrbanismeService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('carte');
  showAddQ = signal(false);
  showAddV = signal(false);
  coucheActive = 'all';
  fQ = { nom:'', code:'', superficie:0, population:0, chef:'' };
  fV = { nom:'', quartier:'', type:'principale', longueur:0, etat:'bon' };

  tabs = [
    { id: 'carte' as Tab,     label: 'Carte communale',     icon: 'ti-map' },
    { id: 'quartiers' as Tab, label: 'Quartiers',           icon: 'ti-map-pin' },
    { id: 'voiries' as Tab,   label: 'Voiries',             icon: 'ti-road' },
    { id: 'reseaux' as Tab,   label: 'Réseaux',             icon: 'ti-topology-star' },
  ];

  ngOnInit(): void {
    this.urb.loadQuartiers();
    this.urb.loadVoiries();
    this.urb.loadReseauxElec();
    this.urb.loadReseauxHydro();
  }

  ajouterQuartier(): void {
    if (!this.fQ.nom) { this.toast.showError('sig', 'Nom obligatoire'); return; }
    this.urb.ajouterQuartier(this.fQ).subscribe({ next: () => { this.toast.show('sig', `Quartier enregistré — ${this.fQ.nom}`); this.showAddQ.set(false); this.fQ = { nom:'', code:'', superficie:0, population:0, chef:'' }; }, error: () => {} });
  }

  ajouterVoirie(): void {
    if (!this.fV.nom || !this.fV.quartier || !this.fV.longueur) { this.toast.showError('sig', 'Nom, quartier et longueur obligatoires'); return; }
    this.urb.ajouterVoirie(this.fV).subscribe({ next: () => { this.toast.show('sig', `Voie enregistrée — ${this.fV.nom}`); this.showAddV.set(false); }, error: () => {} });
  }

  chipEtat(e: string): string    { return { bon:'cv', moyen:'cp', degrade:'ce' }[e] ?? 'cp'; }
  chipHT(t: string): string      { return { HT:'ce', MT:'cp', BT:'cv' }[t] ?? 'cm'; }
  chipReseau(s: string): string  { return { operationnel:'cv', en_travaux:'cp', hors_service:'ce' }[s] ?? 'cp'; }
}
