import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesTechniquesService } from '../../../../core/services/services-techniques.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'preventive' | 'corrective';

@Component({
  selector: 'app-maintenance',
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

<!-- ── KPIs maintenance ───────────────────────────────────────────────── -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:.75rem 1rem;border-bottom:.5px solid var(--color-border-tertiary)">
  <div class="mini-kpi"><span class="mk-v" style="color:#185FA5">{{totalPrev()}}</span><span class="mk-l">Planifiées</span></div>
  <div class="mini-kpi"><span class="mk-v" style="color:#e63946">{{enRetard()}}</span><span class="mk-l">En retard</span></div>
  <div class="mini-kpi"><span class="mk-v" style="color:#F77F00">{{totalCorr()}}</span><span class="mk-l">Pannes signalées</span></div>
  <div class="mini-kpi"><span class="mk-v" style="color:#009A44">{{resolues()}}</span><span class="mk-l">Résolues</span></div>
</div>

<!-- ── Planning préventif ─────────────────────────────────────────────── -->
@if (active()==='preventive') {
  <div class="ph">
    <div class="pt"><i class="ti ti-calendar-stats"></i>Planning de maintenance préventive</div>
    <button class="btn-s" (click)="showAdd.set(!showAdd())"><i class="ti ti-plus"></i>Planifier</button>
  </div>
  @if (showAdd()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Équipement / Installation</div><input class="fi" [(ngModel)]="fPrev.equipement" placeholder="Ex: Groupe électrogène HdV"></div>
        <div class="fg"><div class="fl">Service</div>
          <select class="fs" [(ngModel)]="fPrev.service">
            <option>Voirie</option><option>Éclairage public</option><option>Eau / Assainissement</option><option>Bâtiments</option><option>Général</option>
          </select>
        </div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Type de maintenance</div>
          <select class="fs" [(ngModel)]="fPrev.type">
            <option>Révision générale</option><option>Nettoyage / Dépoussiérage</option>
            <option>Lubrification</option><option>Vérification électrique</option>
            <option>Remplacement pièces</option><option>Contrôle étanchéité</option><option>Autre</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Périodicité</div>
          <select class="fs" [(ngModel)]="fPrev.periodicite">
            <option>Mensuelle</option><option>Trimestrielle</option><option>Semestrielle</option><option>Annuelle</option>
          </select>
        </div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Date prévue</div><input class="fi" type="date" [(ngModel)]="fPrev.datePrevue"></div>
        <div class="fg"><div class="fl">Responsable</div><input class="fi" [(ngModel)]="fPrev.responsable" placeholder="Technicien / équipe"></div>
        <div class="fg"><div class="fl">Coût estimé (FCFA)</div><input class="fi" type="number" [(ngModel)]="fPrev.cout"></div>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAdd.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="planifier()"><i class="ti ti-check"></i>Planifier</button>
      </div>
    </div>
  }
  <div style="padding:6px 8px;border-bottom:.5px solid var(--color-border-tertiary);display:flex;gap:8px">
    <select class="fs" style="max-width:150px" [(ngModel)]="fltPrev" (ngModelChange)="st.loadPlanningMaintenance()">
      <option value="">Tous statuts</option>
      <option value="programme">Programmée</option><option value="en_cours">En cours</option>
      <option value="effectue">Effectuée</option><option value="en_retard">En retard</option>
    </select>
    <select class="fs" style="max-width:150px" [(ngModel)]="fltSvc">
      <option value="">Tous services</option>
      <option>Voirie</option><option>Éclairage public</option><option>Eau / Assainissement</option><option>Bâtiments</option>
    </select>
  </div>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Équipement</th><th>Service</th><th>Type</th><th>Périodicité</th><th>Date prévue</th><th>Responsable</th><th>Coût</th><th>Statut</th><th>Action</th></tr></thead>
      <tbody>
        @for (p of planningFiltre(); track p.id) {
          <tr>
            <td style="font-weight:500">{{p.equipement}}</td>
            <td>{{p.service}}</td>
            <td>{{p.typeMaintenance}}</td>
            <td><span class="chip cn">{{p.periodicite}}</span></td>
            <td [class.date-retard]="estEnRetard(p.datePrevue)">{{p.datePrevue}}</td>
            <td>{{p.responsable}}</td>
            <td>{{p.coutEstime ? (p.coutEstime | number) + ' F' : '—'}}</td>
            <td><span class="chip" [ngClass]="chipPrev(p.statut)">{{p.statut}}</span></td>
            <td>
              @if (p.statut!=='effectue') {
                <button class="btn-s" style="padding:3px 8px;font-size:11px" (click)="valider(p.id)">
                  <i class="ti ti-check"></i>Valider
                </button>
              }
            </td>
          </tr>
        }
        @empty { <tr><td colspan="9" class="empty-row">Aucune maintenance planifiée</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Maintenance corrective ──────────────────────────────────────────── -->
@if (active()==='corrective') {
  <div class="ph">
    <div class="pt"><i class="ti ti-tool"></i>Maintenance corrective</div>
    <button class="btn-p" (click)="showCorr.set(!showCorr())"><i class="ti ti-plus"></i>Signaler une panne</button>
  </div>
  @if (showCorr()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="form-grid">
        <div class="fg"><div class="fl">Équipement / Installation</div><input class="fi" [(ngModel)]="fCorr.equipement" placeholder="Ex: Pompe forage quartier N"></div>
        <div class="fg"><div class="fl">Service</div>
          <select class="fs" [(ngModel)]="fCorr.service">
            <option>Voirie</option><option>Éclairage public</option><option>Eau / Assainissement</option><option>Bâtiments</option>
          </select>
        </div>
      </div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Description de la panne</div>
          <textarea class="fi" style="height:60px;resize:none;padding-top:6px" [(ngModel)]="fCorr.panne" placeholder="Symptômes observés..."></textarea>
        </div>
        <div class="fg"><div class="fl">Priorité</div>
          <select class="fs" [(ngModel)]="fCorr.priorite">
            <option value="normale">Normale</option><option value="haute">Haute</option><option value="urgente">Urgente</option>
          </select>
        </div>
      </div>
      <div class="fg" style="margin-bottom:8px">
        <div class="fl">Photos de la panne <span style="opacity:.6;font-weight:400">(optionnel)</span></div>
        <label class="upload-zone" [class.has-files]="corrPhotos.length>0">
          <input type="file" accept="image/*" multiple style="display:none" (change)="onCorrPhoto($event)">
          <i class="ti ti-camera-plus"></i>
          <span>{{corrPhotos.length ? corrPhotos.length+' photo(s) sélectionnée(s)' : 'Joindre des photos de l\'équipement défaillant'}}</span>
        </label>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showCorr.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="signalerPanne()"><i class="ti ti-send"></i>Signaler</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Équipement</th><th>Service</th><th>Panne</th><th>Priorité</th><th>Technicien</th><th>Signalé le</th><th>Résolu le</th><th>Statut</th><th>Action</th></tr></thead>
      <tbody>
        @for (c of st.maintenanceCorrective(); track c.id) {
          <tr>
            <td style="font-weight:500">{{c.equipement}}</td>
            <td>{{c.service}}</td>
            <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{c.panne}}</td>
            <td><span class="chip" [ngClass]="chipPrio(c.priorite)">{{c.priorite}}</span></td>
            <td>{{c.technicien || 'À assigner'}}</td>
            <td>{{c.dateSignalement}}</td>
            <td>{{c.dateResolution || '—'}}</td>
            <td><span class="chip" [ngClass]="chipCorr(c.statut)">{{c.statut}}</span></td>
            <td>
              @if (c.statut!=='resolu') {
                <button class="btn-s" style="padding:3px 8px;font-size:11px" (click)="resoudre(c.id)">
                  <i class="ti ti-check"></i>Résoudre
                </button>
              }
            </td>
          </tr>
        }
        @empty { <tr><td colspan="9" class="empty-row">Aucune panne corrective signalée</td></tr> }
      </tbody>
    </table>
  </div>
}
@if (toast.get('maint')?.visible) {
  <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('maint')?.message}}</div>
}
</div>
  `
})
export class MaintenanceComponent implements OnInit {
  readonly st    = inject(ServicesTechniquesService);
  readonly toast = inject(ToastService);
  active  = signal<Tab>('preventive');
  saving  = signal(false);
  showAdd  = signal(false);
  showCorr = signal(false);
  fltPrev = '';
  fltSvc  = '';
  fPrev = { equipement:'', service:'Général', type:'Révision générale', periodicite:'Trimestrielle', datePrevue:'', responsable:'', cout:0 };
  fCorr = { equipement:'', service:'Bâtiments', panne:'', priorite:'normale' };
  corrPhotos: File[] = [];

  tabs = [
    { id: 'preventive' as Tab, label: 'Planning préventif',   icon: 'ti-calendar-stats' },
    { id: 'corrective' as Tab, label: 'Maintenance corrective',icon: 'ti-tool' },
  ];

  totalPrev() { return this.st.planningMaint().length; }
  enRetard()  { return this.st.planningMaint().filter(p => p.statut==='en_retard').length; }
  totalCorr() { return this.st.maintenanceCorrective().filter(c => c.statut!=='resolu').length; }
  resolues()  { return this.st.maintenanceCorrective().filter(c => c.statut==='resolu').length; }

  planningFiltre() {
    return this.st.planningMaint().filter(p =>
      (!this.fltPrev || p.statut === this.fltPrev) &&
      (!this.fltSvc  || p.service === this.fltSvc)
    );
  }

  estEnRetard(date: string): boolean {
    return new Date(date) < new Date() && this.fltPrev !== 'effectue';
  }

  ngOnInit(): void { this.st.loadPlanningMaintenance(); this.st.loadMaintenanceCorrective(); }

  planifier(): void {
    if (!this.fPrev.equipement || !this.fPrev.datePrevue || !this.fPrev.responsable) { this.toast.showError('maint', 'Équipement, responsable et date obligatoires'); return; }
    this.saving.set(true);
    this.st.planifierMaintenance({
      equipement: this.fPrev.equipement, service: this.fPrev.service,
      typeMaintenance: this.fPrev.type, datePrevue: this.fPrev.datePrevue,
      periodicite: this.fPrev.periodicite, responsable: this.fPrev.responsable,
      coutEstime: this.fPrev.cout || undefined
    }).subscribe({
      next: p => { this.toast.show('maint', `Maintenance planifiée — ${p.equipement}`); this.saving.set(false); this.showAdd.set(false); this.fPrev = { equipement:'', service:'Général', type:'Révision générale', periodicite:'Trimestrielle', datePrevue:'', responsable:'', cout:0 }; },
      error: () => this.saving.set(false)
    });
  }

  signalerPanne(): void {
    if (!this.fCorr.equipement || !this.fCorr.panne) { this.toast.showError('maint', 'Équipement et description obligatoires'); return; }
    this.saving.set(true);
    this.st.signalerPanneMaintenance(this.fCorr).subscribe({
      next: () => { this.toast.show('maint', 'Panne signalée'); this.saving.set(false); this.showCorr.set(false); this.fCorr = { equipement:'', service:'Bâtiments', panne:'', priorite:'normale' }; },
      error: () => this.saving.set(false)
    });
  }

  valider(id: string): void {
    this.st.planningMaint.update(l => l.map(p => p.id===id ? {...p, statut:'effectue' as const} : p));
    this.toast.show('maint', 'Maintenance validée comme effectuée');
  }

  resoudre(id: string): void {
    this.st.maintenanceCorrective.update(l => l.map(c => c.id===id ? {...c, statut:'resolu' as const, dateResolution: new Date().toISOString().slice(0,10)} : c));
    this.toast.show('maint', 'Panne marquée comme résolue');
  }

  onCorrPhoto(e: Event) { const f = (e.target as HTMLInputElement).files; if (f) this.corrPhotos = Array.from(f); }

  chipPrev(s: string): string { return { programme:'cm', en_cours:'cp', effectue:'cv', en_retard:'ce' }[s] ?? 'cm'; }
  chipPrio(p: string): string { return { normale:'cv', haute:'cp', urgente:'ce' }[p] ?? 'cp'; }
  chipCorr(s: string): string { return { signale:'ce', en_cours:'cp', resolu:'cv' }[s] ?? 'ce'; }
}
