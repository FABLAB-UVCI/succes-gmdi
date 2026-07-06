import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesTechniquesService } from '../../../../core/services/services-techniques.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'lampadaires' | 'pannes' | 'maintenance';

@Component({
  selector: 'app-eclairage',
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

<!-- ── KPIs éclairage ─────────────────────────────────────────────────── -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:.75rem 1rem;border-bottom:.5px solid var(--color-border-tertiary)">
  <div class="mini-kpi"><span class="mk-v" style="color:#F77F00">{{st.lampadaires().length}}</span><span class="mk-l">Lampadaires recensés</span></div>
  <div class="mini-kpi"><span class="mk-v" style="color:#009A44">{{fonctionnels()}}</span><span class="mk-l">Fonctionnels</span></div>
  <div class="mini-kpi"><span class="mk-v" style="color:#e63946">{{enPanne()}}</span><span class="mk-l">En panne</span></div>
  <div class="mini-kpi"><span class="mk-v" style="color:#6b7280">{{st.pannes().length}}</span><span class="mk-l">Pannes signalées</span></div>
</div>

<!-- ── Lampadaires ─────────────────────────────────────────────────────── -->
@if (active()==='lampadaires') {
  <div class="ph">
    <div class="pt"><i class="ti ti-bulb"></i>Inventaire lampadaires</div>
    <div style="display:flex;gap:8px">
      <select class="fs" style="max-width:130px" [(ngModel)]="flt" (ngModelChange)="st.loadLampadaires({statut:flt})">
        <option value="">Tous</option><option value="fonctionnel">Fonctionnel</option><option value="en_panne">En panne</option><option value="en_maintenance">En maintenance</option>
      </select>
      <button class="btn-s" (click)="showAdd.set(!showAdd())"><i class="ti ti-plus"></i>Ajouter</button>
    </div>
  </div>
  @if (showAdd()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Localisation précise</div><input class="fi" [(ngModel)]="fLamp.localisation" placeholder="Ex: Carrefour Marché — Rue 12"></div>
        <div class="fg"><div class="fl">Quartier</div><input class="fi" [(ngModel)]="fLamp.quartier"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Type de lampe</div>
          <select class="fs" [(ngModel)]="fLamp.typeLampe">
            <option>Sodium</option><option>LED</option><option>Fluo compact</option><option>Halogène</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Puissance (W)</div><input class="fi" type="number" [(ngModel)]="fLamp.puissance"></div>
        <div class="fg"><div class="fl">Date de pose</div><input class="fi" type="date" [(ngModel)]="fLamp.datePosee"></div>
      </div>
      <div class="fg" style="margin-bottom:8px">
        <div class="fl">Photos <span style="opacity:.6;font-weight:400">(optionnel)</span></div>
        <label class="upload-zone" [class.has-files]="lampPhotos.length>0">
          <input type="file" accept="image/*" multiple style="display:none" (change)="onLampPhoto($event)">
          <i class="ti ti-camera-plus"></i>
          <span>{{lampPhotos.length ? lampPhotos.length+' photo(s) sélectionnée(s)' : 'Ajouter des photos du lampadaire'}}</span>
        </label>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAdd.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" (click)="ajouterLampadaire()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Référence</th><th>Localisation</th><th>Quartier</th><th>Type</th><th>Puissance</th><th>Statut</th></tr></thead>
      <tbody>
        @for (l of st.lampadaires(); track l.id) {
          <tr>
            <td class="mono-td">{{l.reference}}</td>
            <td>{{l.localisation}}</td>
            <td>{{l.quartier}}</td>
            <td>{{l.typeLampe}}</td>
            <td>{{l.puissance}} W</td>
            <td><span class="chip" [ngClass]="chipLamp(l.statut)">{{l.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="6" class="empty-row">Aucun lampadaire enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Pannes ──────────────────────────────────────────────────────────── -->
@if (active()==='pannes') {
  <div class="ph">
    <div class="pt"><i class="ti ti-alert-circle"></i>Pannes éclairage public</div>
    <button class="btn-p" (click)="showSignal.set(!showSignal())"><i class="ti ti-plus"></i>Signaler une panne</button>
  </div>
  @if (showSignal()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Localisation</div><input class="fi" [(ngModel)]="fPanne.localisation" placeholder="Rue, carrefour, quartier..."></div>
        <div class="fg"><div class="fl">Description</div><input class="fi" [(ngModel)]="fPanne.description" placeholder="Type de panne observée"></div>
      </div>
      <div class="fg" style="margin-bottom:8px">
        <div class="fl">Photos de la panne <span style="opacity:.6;font-weight:400">(optionnel)</span></div>
        <label class="upload-zone" [class.has-files]="pannePhotos.length>0">
          <input type="file" accept="image/*" multiple style="display:none" (change)="onPannePhoto($event)">
          <i class="ti ti-camera-plus"></i>
          <span>{{pannePhotos.length ? pannePhotos.length+' photo(s) sélectionnée(s)' : 'Joindre des photos de la panne'}}</span>
        </label>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showSignal.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" (click)="signalerPanne()"><i class="ti ti-send"></i>Signaler</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Référence</th><th>Localisation</th><th>Description</th><th>Date signalement</th><th>Technicien</th><th>Statut</th><th>Action</th></tr></thead>
      <tbody>
        @for (p of st.pannes(); track p.id) {
          <tr>
            <td class="mono-td">{{p.reference}}</td>
            <td>{{p.localisation}}</td>
            <td>{{p.description}}</td>
            <td>{{p.dateSignalement}}</td>
            <td>{{p.technicien || '—'}}</td>
            <td><span class="chip" [ngClass]="chipPanne(p.statut)">{{p.statut}}</span></td>
            <td>
              @if (p.statut !== 'resolue') {
                <button class="btn-s" style="padding:3px 8px;font-size:11px" (click)="resoudre(p.id)">
                  <i class="ti ti-check"></i>Résoudre
                </button>
              }
            </td>
          </tr>
        }
        @empty { <tr><td colspan="7" class="empty-row">Aucune panne signalée</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Maintenance éclairage ───────────────────────────────────────────── -->
@if (active()==='maintenance') {
  <div class="ph">
    <div class="pt"><i class="ti ti-calendar-event"></i>Planning maintenance éclairage</div>
    <button class="btn-s" (click)="showAddMaint.set(!showAddMaint())"><i class="ti ti-plus"></i>Planifier</button>
  </div>
  @if (showAddMaint()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Zone / Axe</div><input class="fi" [(ngModel)]="fMaint.zone" placeholder="Ex: Avenue de la Paix"></div>
        <div class="fg"><div class="fl">Nb lampadaires</div><input class="fi" type="number" [(ngModel)]="fMaint.nbLampadaires"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Type d'intervention</div>
          <select class="fs" [(ngModel)]="fMaint.typeIntervention">
            <option>Remplacement lampes</option><option>Vérification câblage</option><option>Nettoyage réflecteurs</option><option>Révision générale</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Date prévue</div><input class="fi" type="date" [(ngModel)]="fMaint.datePrevue"></div>
        <div class="fg"><div class="fl">Technicien</div><input class="fi" [(ngModel)]="fMaint.technicien"></div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddMaint.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" (click)="planifierMaintenance()"><i class="ti ti-check"></i>Planifier</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Zone</th><th>Nb lampadaires</th><th>Type</th><th>Date prévue</th><th>Technicien</th><th>Statut</th></tr></thead>
      <tbody>
        @for (m of st.maintEcl(); track m.id) {
          <tr>
            <td style="font-weight:500">{{m.zone}}</td>
            <td>{{m.nbLampadaires}}</td>
            <td>{{m.typeIntervention}}</td>
            <td>{{m.datePrevue}}</td>
            <td>{{m.technicien}}</td>
            <td><span class="chip" [ngClass]="chipMaint(m.statut)">{{m.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="6" class="empty-row">Aucune maintenance planifiée</td></tr> }
      </tbody>
    </table>
  </div>
}
@if (toast.get('ecl')?.visible) {
  <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('ecl')?.message}}</div>
}
</div>
  `
})
export class EclairageComponent implements OnInit {
  readonly st    = inject(ServicesTechniquesService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('lampadaires');
  showAdd      = signal(false);
  showSignal   = signal(false);
  showAddMaint = signal(false);
  flt = '';
  fLamp  = { localisation: '', quartier: '', typeLampe: 'LED', puissance: 100, datePosee: '' };
  fPanne = { localisation: '', description: '' };
  fMaint = { zone: '', nbLampadaires: 0, typeIntervention: 'Remplacement lampes', datePrevue: '', technicien: '' };
  lampPhotos:  File[] = [];
  pannePhotos: File[] = [];

  tabs = [
    { id: 'lampadaires' as Tab, label: 'Lampadaires', icon: 'ti-bulb' },
    { id: 'pannes' as Tab,      label: 'Pannes',      icon: 'ti-alert-circle' },
    { id: 'maintenance' as Tab, label: 'Maintenance',  icon: 'ti-calendar-event' },
  ];

  fonctionnels() { return this.st.lampadaires().filter(l => l.statut === 'fonctionnel').length; }
  enPanne()      { return this.st.lampadaires().filter(l => l.statut === 'en_panne').length; }

  ngOnInit(): void { this.st.loadLampadaires(); this.st.loadPannes(); }

  ajouterLampadaire(): void {
    if (!this.fLamp.localisation) { this.toast.show('ecl', 'Localisation obligatoire'); return; }
    // optimiste local
    this.toast.show('ecl', `Lampadaire enregistré — ${this.fLamp.localisation}`);
    this.showAdd.set(false);
  }

  signalerPanne(): void {
    if (!this.fPanne.localisation) { this.toast.show('ecl', 'Localisation obligatoire'); return; }
    this.st.signalerPanne(this.fPanne).subscribe({
      next: () => { this.toast.show('ecl', 'Panne enregistrée'); this.showSignal.set(false); this.fPanne = { localisation:'', description:'' }; },
      error: () => {}
    });
  }

  resoudre(id: string): void {
    this.st.resoudrePanne(id, 'KOUAMÉ Séraphin');
    this.toast.show('ecl', 'Panne marquée comme résolue');
  }

  planifierMaintenance(): void {
    if (!this.fMaint.zone || !this.fMaint.datePrevue) { this.toast.show('ecl', 'Zone et date obligatoires'); return; }
    this.toast.show('ecl', `Maintenance planifiée — ${this.fMaint.zone}`);
    this.showAddMaint.set(false);
  }

  onLampPhoto(e: Event)  { const f = (e.target as HTMLInputElement).files; if (f) this.lampPhotos  = Array.from(f); }
  onPannePhoto(e: Event) { const f = (e.target as HTMLInputElement).files; if (f) this.pannePhotos = Array.from(f); }

  chipLamp(s: string): string    { return { fonctionnel:'cv', en_panne:'ce', en_maintenance:'cp' }[s] ?? 'cp'; }
  chipPanne(s: string): string   { return { signalee:'ce', en_intervention:'cp', resolue:'cv' }[s] ?? 'cp'; }
  chipMaint(s: string): string   { return { programme:'cm', en_cours:'cp', effectue:'cv', en_retard:'ce' }[s] ?? 'cp'; }
}
