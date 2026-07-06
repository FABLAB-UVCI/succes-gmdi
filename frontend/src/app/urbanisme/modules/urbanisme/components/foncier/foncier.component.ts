import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrbanismeService } from '../../../../core/services/urbanisme.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'parcelles' | 'lots' | 'titres' | 'reserves';

@Component({
  selector: 'app-foncier',
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

<!-- ── Parcelles ──────────────────────────────────────────────────────── -->
@if (active()==='parcelles') {
  <div class="ph">
    <div class="pt"><i class="ti ti-map-2"></i>Registre des parcelles</div>
    <div style="display:flex;gap:8px">
      <select class="fs" style="max-width:130px" [(ngModel)]="flt.statut" (ngModelChange)="urb.loadParcelles({statut:flt.statut})">
        <option value="">Tous statuts</option>
        <option value="libre">Libre</option><option value="occupe">Occupé</option>
        <option value="litige">Litige</option><option value="reserve">Réservé</option>
      </select>
      <button class="btn-s" (click)="showAddPar.set(!showAddPar())"><i class="ti ti-plus"></i>Enregistrer</button>
    </div>
  </div>
  @if (showAddPar()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="fsec">Nouvelle parcelle</div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Propriétaire</div><input class="fi" [(ngModel)]="fPar.proprietaire" placeholder="Nom complet ou raison sociale"></div>
        <div class="fg"><div class="fl">Localisation</div><input class="fi" [(ngModel)]="fPar.localisation" placeholder="Adresse précise"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Quartier</div><input class="fi" [(ngModel)]="fPar.quartier"></div>
        <div class="fg"><div class="fl">Superficie (m²)</div><input class="fi" type="number" [(ngModel)]="fPar.superficie"></div>
        <div class="fg"><div class="fl">Usage</div>
          <select class="fs" [(ngModel)]="fPar.usage">
            <option>Résidentiel</option><option>Commercial</option><option>Industriel</option>
            <option>Agricole</option><option>Administratif</option><option>Mixte</option>
          </select>
        </div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">N° Titre foncier</div><input class="fi" [(ngModel)]="fPar.titreFoncier" placeholder="TF-CI-ABJ-2025-XXXX"></div>
        <div class="fg"><div class="fl">Statut</div>
          <select class="fs" [(ngModel)]="fPar.statut">
            <option value="libre">Libre</option><option value="occupe">Occupé</option>
            <option value="litige">Litige</option><option value="reserve">Réservé</option>
          </select>
        </div>
      </div>
      <div class="fsec"><i class="ti ti-paperclip" style="font-size:11px;margin-right:4px"></i>Pièces jointes</div>
      <div class="form-grid">
        <div class="fg">
          <div class="fl">Joindre un document (PDF, image)</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFilePar($event)">
          @if (filePar) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{filePar}}</div> }
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddPar.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterParcelle()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }

  <!-- Compteurs ────────────────────────────────────────────────────────── -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:.75rem 1rem;border-bottom:.5px solid var(--color-border-tertiary)">
    @for (s of statutsPar; track s.val) {
      <div class="mini-kpi" style="cursor:pointer" (click)="flt.statut=s.val; urb.loadParcelles({statut:s.val})">
        <span class="mk-v" [style.color]="s.color">{{countPar(s.val)}}</span>
        <span class="mk-l">{{s.label}}</span>
      </div>
    }
  </div>

  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Référence</th><th>Propriétaire</th><th>Localisation</th><th>Quartier</th><th>Superficie</th><th>Usage</th><th>Titre</th><th>Statut</th></tr></thead>
      <tbody>
        @for (p of urb.parcelles(); track p.id) {
          <tr>
            <td class="mono-td">{{p.reference}}</td>
            <td style="font-weight:500">{{p.proprietaire}}</td>
            <td>{{p.localisation}}</td>
            <td>{{p.quartier}}</td>
            <td>{{p.superficie | number}} m²</td>
            <td>{{p.usage}}</td>
            <td class="mono-td">{{p.titreFoncier || '—'}}</td>
            <td><span class="chip" [ngClass]="chipPar(p.statut)">{{p.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="8" class="empty-row">Aucune parcelle enregistrée</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Lots ──────────────────────────────────────────────────────────── -->
@if (active()==='lots') {
  <div class="ph">
    <div class="pt"><i class="ti ti-layout-grid"></i>Lots de lotissement</div>
    <button class="btn-s" (click)="showAddLot.set(!showAddLot())"><i class="ti ti-plus"></i>Ajouter lot</button>
  </div>
  @if (showAddLot()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Lotissement</div><input class="fi" [(ngModel)]="fLot.lotissement" placeholder="Nom du lotissement"></div>
        <div class="fg"><div class="fl">Référence lot</div><input class="fi" [(ngModel)]="fLot.reference" placeholder="LOT-A-001"></div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Superficie (m²)</div><input class="fi" type="number" [(ngModel)]="fLot.superficie"></div>
        <div class="fg"><div class="fl">Attributaire</div><input class="fi" [(ngModel)]="fLot.attributaire" placeholder="Nom (si attribué)"></div>
      </div>
      <div class="fsec"><i class="ti ti-paperclip" style="font-size:11px;margin-right:4px"></i>Pièces jointes</div>
      <div class="form-grid">
        <div class="fg">
          <div class="fl">Joindre un document</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileLot($event)">
          @if (fileLot) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{fileLot}}</div> }
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddLot.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterLot()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Référence</th><th>Lotissement</th><th>Superficie</th><th>Attributaire</th><th>Date attribution</th><th>Statut</th></tr></thead>
      <tbody>
        @for (l of urb.lots(); track l.id) {
          <tr>
            <td class="mono-td">{{l.reference}}</td>
            <td style="font-weight:500">{{l.lotissement}}</td>
            <td>{{l.superficie | number}} m²</td>
            <td>{{l.attributaire || '—'}}</td>
            <td>{{l.dateAttribution || '—'}}</td>
            <td><span class="chip" [ngClass]="chipLot(l.statut)">{{l.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="6" class="empty-row">Aucun lot enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Titres fonciers ─────────────────────────────────────────────────── -->
@if (active()==='titres') {
  <div class="ph">
    <div class="pt"><i class="ti ti-file-certificate"></i>Titres fonciers</div>
    <button class="btn-s" (click)="showAddTF.set(!showAddTF())"><i class="ti ti-plus"></i>Enregistrer</button>
  </div>
  @if (showAddTF()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">N° Titre foncier</div><input class="fi" [(ngModel)]="fTF.numero" placeholder="TF-CI-ABJ-2025-XXXXX"></div>
        <div class="fg"><div class="fl">Type</div>
          <select class="fs" [(ngModel)]="fTF.type">
            <option value="TF">Titre Foncier (TF)</option>
            <option value="ACD">Arrêté de Concession Définitive (ACD)</option>
            <option value="CU">Certificat d'Urbanisme (CU)</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Propriétaire</div><input class="fi" [(ngModel)]="fTF.proprietaire"></div>
        <div class="fg"><div class="fl">Superficie (m²)</div><input class="fi" type="number" [(ngModel)]="fTF.superficie"></div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Localisation</div><input class="fi" [(ngModel)]="fTF.localisation"></div>
        <div class="fg"><div class="fl">Date de délivrance</div><input class="fi" type="date" [(ngModel)]="fTF.dateDelivrance"></div>
      </div>
      <div class="fsec"><i class="ti ti-map-pin" style="font-size:11px;margin-right:4px"></i>Localisation GPS</div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Latitude</div><input class="fi" type="number" step="0.000001" [(ngModel)]="fTF.lat" placeholder="Ex: 5.3600"></div>
        <div class="fg"><div class="fl">Longitude</div><input class="fi" type="number" step="0.000001" [(ngModel)]="fTF.lng" placeholder="Ex: -4.0083"></div>
      </div>
      <div class="fsec"><i class="ti ti-paperclip" style="font-size:11px;margin-right:4px"></i>Pièces jointes</div>
      <div class="form-grid">
        <div class="fg">
          <div class="fl">Joindre un document</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileTF($event)">
          @if (fileTF) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{fileTF}}</div> }
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddTF.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterTF()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>N° Titre</th><th>Type</th><th>Propriétaire</th><th>Superficie</th><th>Localisation</th><th>GPS</th><th>Délivré le</th><th>Statut</th></tr></thead>
      <tbody>
        @for (t of urb.titresFonciers(); track t.id) {
          <tr>
            <td class="mono-td">{{t.numero}}</td>
            <td><span class="chip cm">{{t.type}}</span></td>
            <td style="font-weight:500">{{t.proprietaire}}</td>
            <td>{{t.superficie | number}} m²</td>
            <td>{{t.localisation}}</td>
            <td class="mono-td">{{t.coordonnees ? (t.coordonnees.lat | number:'1.4-4') + ', ' + (t.coordonnees.lng | number:'1.4-4') : '—'}}</td>
            <td>{{t.dateDelivrance || '—'}}</td>
            <td><span class="chip" [ngClass]="chipTF(t.statut)">{{t.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="8" class="empty-row">Aucun titre foncier enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Réserves administratives ───────────────────────────────────────── -->
@if (active()==='reserves') {
  <div class="ph">
    <div class="pt"><i class="ti ti-bookmark"></i>Réserves administratives</div>
    <button class="btn-s" (click)="showAddRes.set(!showAddRes())"><i class="ti ti-plus"></i>Enregistrer</button>
  </div>
  @if (showAddRes()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Dénomination</div><input class="fi" [(ngModel)]="fRes.denomination" placeholder="Ex: Site École Publique Nouveau Quartier"></div>
        <div class="fg"><div class="fl">Usage prévu</div><input class="fi" [(ngModel)]="fRes.usage" placeholder="Ex: École, Marché, Espace vert..."></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Superficie (m²)</div><input class="fi" type="number" [(ngModel)]="fRes.superficie"></div>
        <div class="fg"><div class="fl">Localisation</div><input class="fi" [(ngModel)]="fRes.localisation"></div>
        <div class="fg"><div class="fl">Administration</div><input class="fi" [(ngModel)]="fRes.administration" placeholder="Ministère, Mairie..."></div>
      </div>
      <div class="fsec"><i class="ti ti-map-pin" style="font-size:11px;margin-right:4px"></i>Localisation GPS</div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Latitude</div><input class="fi" type="number" step="0.000001" [(ngModel)]="fRes.lat" placeholder="Ex: 5.3600"></div>
        <div class="fg"><div class="fl">Longitude</div><input class="fi" type="number" step="0.000001" [(ngModel)]="fRes.lng" placeholder="Ex: -4.0083"></div>
      </div>
      <div class="fsec"><i class="ti ti-paperclip" style="font-size:11px;margin-right:4px"></i>Pièces jointes</div>
      <div class="form-grid">
        <div class="fg">
          <div class="fl">Joindre un document</div>
          <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileRes($event)">
          @if (fileRes) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{fileRes}}</div> }
        </div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddRes.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterReserve()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Dénomination</th><th>Usage</th><th>Superficie</th><th>Localisation</th><th>GPS</th><th>Administration</th><th>Statut</th></tr></thead>
      <tbody>
        @for (r of urb.reserves(); track r.id) {
          <tr>
            <td style="font-weight:500">{{r.denomination}}</td>
            <td>{{r.usage}}</td>
            <td>{{r.superficie | number}} m²</td>
            <td>{{r.localisation}}</td>
            <td class="mono-td">{{r.coordonnees ? (r.coordonnees.lat | number:'1.4-4') + ', ' + (r.coordonnees.lng | number:'1.4-4') : '—'}}</td>
            <td>{{r.administration || '—'}}</td>
            <td><span class="chip" [ngClass]="chipRes(r.statut)">{{r.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="7" class="empty-row">Aucune réserve enregistrée</td></tr> }
      </tbody>
    </table>
  </div>
}

@if (toast.get('fon')?.visible) {
  <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('fon')?.message}}</div>
}
</div>
  `
})
export class FoncierComponent implements OnInit {
  readonly urb   = inject(UrbanismeService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('parcelles');
  saving = signal(false);
  showAddPar = signal(false);
  showAddLot = signal(false);
  showAddTF  = signal(false);
  showAddRes = signal(false);
  flt = { statut: '' };
  filePar = ''; fileLot = ''; fileTF = ''; fileRes = '';
  fPar = { proprietaire:'', localisation:'', quartier:'', superficie:0, usage:'Résidentiel', titreFoncier:'', statut:'libre' };
  fLot = { lotissement:'', reference:'', superficie:0, attributaire:'' };
  fTF  = { numero:'', type:'TF', proprietaire:'', superficie:0, localisation:'', dateDelivrance:'', lat:0, lng:0 };
  fRes = { denomination:'', usage:'', superficie:0, localisation:'', administration:'', lat:0, lng:0 };

  tabs = [
    { id: 'parcelles' as Tab, label: 'Parcelles',          icon: 'ti-map-2' },
    { id: 'lots' as Tab,      label: 'Lots',               icon: 'ti-layout-grid' },
    { id: 'titres' as Tab,    label: 'Titres fonciers',    icon: 'ti-file-certificate' },
    { id: 'reserves' as Tab,  label: 'Réserves admin.',    icon: 'ti-bookmark' },
  ];

  statutsPar = [
    { val: '', label: 'Total', color: '#F47920' },
    { val: 'libre', label: 'Libres', color: '#009A44' },
    { val: 'occupe', label: 'Occupées', color: '#F77F00' },
    { val: 'litige', label: 'Litiges', color: '#e63946' },
  ];

  ngOnInit(): void {
    this.urb.loadParcelles();
    this.urb.loadLots();
    this.urb.loadTitresFonciers();
    this.urb.loadReserves();
  }

  countPar(s: string): number {
    return s ? this.urb.parcelles().filter(p => p.statut === s).length : this.urb.parcelles().length;
  }

  onFilePar(e: Event): void { this.filePar = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }
  onFileLot(e: Event): void { this.fileLot = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }
  onFileTF(e: Event):  void { this.fileTF  = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }
  onFileRes(e: Event): void { this.fileRes = (e.target as HTMLInputElement).files?.[0]?.name ?? ''; }

  ajouterParcelle(): void {
    if (!this.fPar.proprietaire || !this.fPar.localisation) { this.toast.show('fon', 'Propriétaire et localisation obligatoires'); return; }
    this.saving.set(true);
    this.urb.ajouterParcelle(this.fPar).subscribe({
      next: p => { this.toast.show('fon', `Parcelle enregistrée — ${p.reference}`); this.saving.set(false); this.showAddPar.set(false); this.fPar = { proprietaire:'', localisation:'', quartier:'', superficie:0, usage:'Résidentiel', titreFoncier:'', statut:'libre' }; this.filePar = ''; },
      error: () => this.saving.set(false)
    });
  }

  ajouterLot(): void {
    if (!this.fLot.lotissement || !this.fLot.reference) { this.toast.show('fon', 'Lotissement et référence obligatoires'); return; }
    this.saving.set(true);
    this.urb.ajouterLot(this.fLot).subscribe({
      next: () => { this.toast.show('fon', 'Lot enregistré'); this.saving.set(false); this.showAddLot.set(false); this.fileLot = ''; },
      error: () => this.saving.set(false)
    });
  }

  ajouterTF(): void {
    if (!this.fTF.numero || !this.fTF.proprietaire) { this.toast.show('fon', 'N° titre et propriétaire obligatoires'); return; }
    this.saving.set(true);
    const payload = { ...this.fTF, coordonnees: this.fTF.lat ? { lat: this.fTF.lat, lng: this.fTF.lng } : undefined };
    this.urb.ajouterTitreFoncier(payload).subscribe({
      next: () => { this.toast.show('fon', `Titre enregistré — ${this.fTF.numero}`); this.saving.set(false); this.showAddTF.set(false); this.fileTF = ''; },
      error: () => this.saving.set(false)
    });
  }

  ajouterReserve(): void {
    if (!this.fRes.denomination) { this.toast.show('fon', 'Dénomination obligatoire'); return; }
    this.saving.set(true);
    const payload = { ...this.fRes, coordonnees: this.fRes.lat ? { lat: this.fRes.lat, lng: this.fRes.lng } : undefined };
    this.urb.ajouterReserve(payload).subscribe({
      next: () => { this.toast.show('fon', `Réserve enregistrée — ${this.fRes.denomination}`); this.saving.set(false); this.showAddRes.set(false); this.fileRes = ''; },
      error: () => this.saving.set(false)
    });
  }

  chipPar(s: string): string { return { libre:'cv', occupe:'cp', litige:'ce', reserve:'cm' }[s] ?? 'cn'; }
  chipLot(s: string): string { return { disponible:'cv', attribue:'cp', construit:'cn' }[s] ?? 'cn'; }
  chipTF(s: string): string  { return { valide:'cv', expire:'ce', litige:'ce', en_cours:'cm' }[s] ?? 'cm'; }
  chipRes(s: string): string { return { reserve:'cm', affecte:'cv', libere:'cn' }[s] ?? 'cm'; }
}
