import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicesTechniquesService } from '../../../../core/services/services-techniques.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'routes' | 'entretiens' | 'reparations';

@Component({
  selector: 'app-voirie',
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

<!-- ── Routes ─────────────────────────────────────────────────────────── -->
@if (active()==='routes') {
  <div class="ph">
    <div class="pt"><i class="ti ti-road"></i>Réseau routier communal</div>
    <button class="btn-s" (click)="showAddRoute.set(!showAddRoute())"><i class="ti ti-plus"></i>Ajouter</button>
  </div>
  @if (showAddRoute()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="fsec">Nouvelle route</div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Nom / Libellé</div><input class="fi" [(ngModel)]="fRoute.nom" placeholder="Ex: Avenue du Commerce"></div>
        <div class="fg"><div class="fl">Quartier</div><input class="fi" [(ngModel)]="fRoute.quartier" placeholder="Ex: Yopougon Selmer"></div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Longueur (m)</div><input class="fi" type="number" [(ngModel)]="fRoute.longueur"></div>
        <div class="fg"><div class="fl">Type</div>
          <select class="fs" [(ngModel)]="fRoute.type">
            <option value="bitumee">Bitumée</option><option value="laterite">Latérite</option><option value="piste">Piste</option>
          </select>
        </div>
        <div class="fg"><div class="fl">État actuel</div>
          <select class="fs" [(ngModel)]="fRoute.etat">
            <option value="bon">Bon</option><option value="moyen">Moyen</option><option value="degrade">Dégradé</option><option value="critique">Critique</option>
          </select>
        </div>
      </div>
      <div class="fg" style="margin-bottom:8px">
        <div class="fl">Photos <span style="opacity:.6;font-weight:400">(optionnel)</span></div>
        <label class="upload-zone" [class.has-files]="routePhotos.length>0">
          <input type="file" accept="image/*" multiple style="display:none" (change)="onRoutePhoto($event)">
          <i class="ti ti-camera-plus"></i>
          <span>{{routePhotos.length ? routePhotos.length+' photo(s) sélectionnée(s)' : 'Cliquer pour ajouter des photos de la route'}}</span>
        </label>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddRoute.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="ajouterRoute()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div style="padding:6px 8px;border-bottom:.5px solid var(--color-border-tertiary);display:flex;gap:8px">
    <input class="fi" style="max-width:200px" [(ngModel)]="flt.search" placeholder="Rechercher...">
    <select class="fs" style="max-width:130px" [(ngModel)]="flt.etat" (ngModelChange)="st.loadRoutes({etat:flt.etat})">
      <option value="">Tous états</option><option value="bon">Bon</option><option value="moyen">Moyen</option><option value="degrade">Dégradé</option><option value="critique">Critique</option>
    </select>
  </div>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Libellé</th><th>Quartier</th><th>Longueur</th><th>Type</th><th>État</th><th>Dernier entretien</th></tr></thead>
      <tbody>
        @for (r of st.routes(); track r.id) {
          <tr>
            <td style="font-weight:500">{{r.nom}}</td>
            <td>{{r.quartier}}</td>
            <td>{{r.longueur | number}} m</td>
            <td>{{r.type}}</td>
            <td><span class="chip" [ngClass]="chipEtat(r.etat)">{{r.etat}}</span></td>
            <td>{{r.dateDernierEntretien || '—'}}</td>
          </tr>
        }
        @empty { <tr><td colspan="6" class="empty-row">Aucune route enregistrée</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Entretiens des rues ─────────────────────────────────────────────── -->
@if (active()==='entretiens') {
  <div class="ph">
    <div class="pt"><i class="ti ti-tool"></i>Entretien des rues</div>
    <button class="btn-s" (click)="showAddEnt.set(!showAddEnt())"><i class="ti ti-plus"></i>Planifier</button>
  </div>
  @if (showAddEnt()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="fsec">Nouvel entretien</div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Route concernée</div><input class="fi" [(ngModel)]="fEnt.route" placeholder="Nom de la route"></div>
        <div class="fg"><div class="fl">Type d'entretien</div>
          <select class="fs" [(ngModel)]="fEnt.typeEntretien">
            <option>Curage des caniveaux</option><option>Rebouchage nids-de-poule</option><option>Réfection de chaussée</option><option>Élagage abords</option><option>Nettoyage</option><option>Autre</option>
          </select>
        </div>
      </div>
      <div class="form-grid-3">
        <div class="fg"><div class="fl">Date début</div><input class="fi" type="date" [(ngModel)]="fEnt.dateDebut"></div>
        <div class="fg"><div class="fl">Date fin prévue</div><input class="fi" type="date" [(ngModel)]="fEnt.dateFin"></div>
        <div class="fg"><div class="fl">Coût estimé (FCFA)</div><input class="fi" type="number" [(ngModel)]="fEnt.coutEstime"></div>
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Équipe responsable</div><input class="fi" [(ngModel)]="fEnt.equipe" placeholder="Ex: Équipe Voirie Nord"></div>
      <div class="fa">
        <button class="btn-s" (click)="showAddEnt.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="planifierEntretien()"><i class="ti ti-check"></i>Planifier</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Route</th><th>Type entretien</th><th>Début</th><th>Fin prévue</th><th>Équipe</th><th>Coût estimé</th><th>Statut</th></tr></thead>
      <tbody>
        @for (e of st.entretiensVoirie(); track e.id) {
          <tr>
            <td style="font-weight:500">{{e.route}}</td>
            <td>{{e.typeEntretien}}</td>
            <td>{{e.dateDebut}}</td>
            <td>{{e.dateFin || '—'}}</td>
            <td>{{e.equipe}}</td>
            <td>{{e.coutEstime | number}} FCFA</td>
            <td><span class="chip" [ngClass]="chipStatut(e.statut)">{{e.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="7" class="empty-row">Aucun entretien planifié</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Réparations ────────────────────────────────────────────────────── -->
@if (active()==='reparations') {
  <div class="ph">
    <div class="pt"><i class="ti ti-alert-triangle"></i>Réparations voirie</div>
    <button class="btn-s" (click)="showAddRep.set(!showAddRep())"><i class="ti ti-plus"></i>Signaler</button>
  </div>
  @if (showAddRep()) {
    <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
      <div class="fsec">Nouveau signalement</div>
      <div class="form-grid">
        <div class="fg"><div class="fl">Route / Localisation</div><input class="fi" [(ngModel)]="fRep.route" placeholder="Rue, avenue, carrefour..."></div>
        <div class="fg"><div class="fl">Priorité</div>
          <select class="fs" [(ngModel)]="fRep.priorite">
            <option value="normale">Normale</option><option value="haute">Haute</option><option value="urgente">Urgente</option>
          </select>
        </div>
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Description du problème</div>
        <textarea class="fi" style="height:60px;resize:none;padding-top:6px" [(ngModel)]="fRep.description" placeholder="Décrivez le dégât..."></textarea>
      </div>
      <div class="fg" style="margin-bottom:8px"><div class="fl">Signalé par</div><input class="fi" [(ngModel)]="fRep.signalePar" placeholder="Nom du déclarant"></div>
      <div class="fg" style="margin-bottom:8px">
        <div class="fl">Photos du dégât <span style="opacity:.6;font-weight:400">(optionnel)</span></div>
        <label class="upload-zone" [class.has-files]="repPhotos.length>0">
          <input type="file" accept="image/*" multiple style="display:none" (change)="onRepPhoto($event)">
          <i class="ti ti-camera-plus"></i>
          <span>{{repPhotos.length ? repPhotos.length+' photo(s) sélectionnée(s)' : 'Joindre des photos du problème'}}</span>
        </label>
      </div>
      <div class="fa">
        <button class="btn-s" (click)="showAddRep.set(false)"><i class="ti ti-x"></i>Annuler</button>
        <button class="btn-p" [disabled]="saving()" (click)="signalerReparation()"><i class="ti ti-check"></i>Enregistrer</button>
      </div>
    </div>
  }
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Localisation</th><th>Description</th><th>Priorité</th><th>Signalé par</th><th>Date</th><th>Statut</th></tr></thead>
      <tbody>
        @for (r of st.reparationsVoirie(); track r.id) {
          <tr>
            <td style="font-weight:500">{{r.route}}</td>
            <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{r.description}}</td>
            <td><span class="chip" [ngClass]="chipPriorite(r.priorite)">{{r.priorite}}</span></td>
            <td>{{r.signalePar}}</td>
            <td>{{r.dateSignalement}}</td>
            <td><span class="chip" [ngClass]="chipStatutPanne(r.statut)">{{r.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="6" class="empty-row">Aucune réparation signalée</td></tr> }
      </tbody>
    </table>
  </div>
}
@if (toast.get('v')?.visible) {
  <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('v')?.message}}</div>
}
</div>
  `
})
export class VoirieComponent implements OnInit {
  readonly st    = inject(ServicesTechniquesService);
  readonly toast = inject(ToastService);
  active  = signal<Tab>('routes');
  saving  = signal(false);
  showAddRoute = signal(false);
  showAddEnt   = signal(false);
  showAddRep   = signal(false);
  flt = { search: '', etat: '' };
  fRoute = { nom: '', quartier: '', longueur: 0, type: 'bitumee', etat: 'bon' };
  fEnt   = { route: '', typeEntretien: 'Curage des caniveaux', dateDebut: '', dateFin: '', equipe: '', coutEstime: 0 };
  fRep   = { route: '', description: '', priorite: 'normale', signalePar: '' };
  routePhotos: File[] = [];
  repPhotos:   File[] = [];

  tabs = [
    { id: 'routes' as Tab,      label: 'Routes',        icon: 'ti-road' },
    { id: 'entretiens' as Tab,  label: 'Entretien rues',icon: 'ti-tool' },
    { id: 'reparations' as Tab, label: 'Réparations',   icon: 'ti-alert-triangle' },
  ];

  ngOnInit(): void { this.st.loadRoutes(); this.st.loadEntretiensVoirie(); this.st.loadReparationsVoirie(); }

  ajouterRoute(): void {
    if (!this.fRoute.nom || !this.fRoute.quartier) { this.toast.show('v', 'Nom et quartier obligatoires'); return; }
    this.saving.set(true);
    this.st.ajouterRoute(this.fRoute).subscribe({
      next: r => { this.toast.show('v', `Route enregistrée — ${r.nom}`); this.saving.set(false); this.showAddRoute.set(false); this.fRoute = { nom:'', quartier:'', longueur:0, type:'bitumee', etat:'bon' }; },
      error: () => this.saving.set(false)
    });
  }

  planifierEntretien(): void {
    if (!this.fEnt.route || !this.fEnt.dateDebut) { this.toast.show('v', 'Route et date obligatoires'); return; }
    this.saving.set(true);
    this.st.planifierEntretienVoirie({ route: this.fEnt.route, typeEntretien: this.fEnt.typeEntretien, dateDebut: this.fEnt.dateDebut, dateFin: this.fEnt.dateFin, equipe: this.fEnt.equipe, coutEstime: this.fEnt.coutEstime }).subscribe({
      next: e => { this.toast.show('v', `Entretien planifié — ${e.route}`); this.saving.set(false); this.showAddEnt.set(false); this.fEnt = { route:'', typeEntretien:'Curage des caniveaux', dateDebut:'', dateFin:'', equipe:'', coutEstime:0 }; },
      error: () => this.saving.set(false)
    });
  }

  signalerReparation(): void {
    if (!this.fRep.route || !this.fRep.description) { this.toast.show('v', 'Localisation et description obligatoires'); return; }
    this.saving.set(true);
    this.st.signalerReparation({ route: this.fRep.route, description: this.fRep.description, priorite: this.fRep.priorite, signalePar: this.fRep.signalePar || 'Anonyme' }).subscribe({
      next: () => { this.toast.show('v', 'Réparation enregistrée'); this.saving.set(false); this.showAddRep.set(false); this.fRep = { route:'', description:'', priorite:'normale', signalePar:'' }; },
      error: () => this.saving.set(false)
    });
  }

  onRoutePhoto(e: Event) { const f = (e.target as HTMLInputElement).files; if (f) this.routePhotos = Array.from(f); }
  onRepPhoto(e: Event)   { const f = (e.target as HTMLInputElement).files; if (f) this.repPhotos   = Array.from(f); }

  chipEtat(e: string): string { return { bon:'cv', moyen:'cp', degrade:'cn', critique:'ce' }[e] ?? 'cp'; }
  chipStatut(s: string): string { return { planifie:'cm', en_cours:'cp', termine:'cv', suspendu:'ce' }[s] ?? 'cp'; }
  chipPriorite(p: string): string { return { normale:'cv', haute:'cp', urgente:'ce' }[p] ?? 'cp'; }
  chipStatutPanne(s: string): string { return { signalee:'ce', en_intervention:'cp', resolue:'cv' }[s] ?? 'cp'; }
}
