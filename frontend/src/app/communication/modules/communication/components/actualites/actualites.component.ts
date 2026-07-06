import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationService } from '../../../../core/services/communication.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'liste' | 'communique' | 'annonce' | 'evenement';
const TYPE_COLORS: Record<string, string> = { communique: '#003366', annonce: '#F77F00', evenement: '#009A44' };

@Component({
  selector: 'app-actualites',
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

<!-- ── Liste toutes publications ──────────────────────────────────────── -->
@if (active()==='liste') {
  <div class="ph">
    <div class="pt"><i class="ti ti-news"></i>Publications récentes</div>
    <div style="display:flex;gap:8px">
      <button class="btn-s" (click)="exportActualites()"><i class="ti ti-download"></i>Exporter</button>
      <button class="btn-d"><i class="ti ti-eye"></i>Portail citoyen</button>
    </div>
  </div>
  <div style="padding:6px 8px;border-bottom:.5px solid var(--color-border-tertiary);display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <input class="fi" style="max-width:180px" [(ngModel)]="flt.search" placeholder="Rechercher..." (ngModelChange)="com.loadActualites({search:flt.search,type:flt.type,statut:flt.statut})">
    <select class="fs" style="max-width:140px" [(ngModel)]="flt.type" (ngModelChange)="com.loadActualites({type:flt.type,statut:flt.statut})">
      <option value="">Tous types</option>
      <option value="communique">Communiqué</option><option value="annonce">Annonce</option><option value="evenement">Événement</option>
    </select>
    <select class="fs" style="max-width:130px" [(ngModel)]="flt.statut" (ngModelChange)="com.loadActualites({type:flt.type,statut:flt.statut})">
      <option value="">Tous statuts</option><option value="publie">Publié</option><option value="brouillon">Brouillon</option>
    </select>
    <span style="font-size:11px;color:var(--color-text-secondary);margin-left:auto">{{com.actualites().length}} publication(s)</span>
  </div>
  <div style="padding:.5rem 1rem;display:flex;flex-direction:column;gap:8px">
    @for (a of com.actualites(); track a.id) {
      <div class="art-card">
        <div class="art-tag" [style.background]="typeColor(a.type)"></div>
        <div class="art-body">
          <div class="art-cat" [style.color]="typeColor(a.type)">{{a.type.toUpperCase()}}</div>
          <div class="art-titre">{{a.titre}}</div>
          <div class="art-meta">
            <i class="ti ti-calendar" style="font-size:10px;margin-right:3px"></i>{{a.date}} —
            <i class="ti ti-user" style="font-size:10px;margin-right:3px"></i>{{a.auteur}}
          </div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:6px">
            <span class="chip" [ngClass]="chipStatut(a.statut)">{{a.statut}}</span>
            @if (a.statut==='brouillon') {
              <button class="btn-s" style="padding:3px 8px;font-size:11px;color:#009A44;border-color:#9fd9b8" (click)="publierDirectement(a.id)">
                <i class="ti ti-send"></i>Publier
              </button>
            }
            <button class="btn-s" style="padding:3px 8px;font-size:11px;color:#185FA5;border-color:#b5d4f4">
              <i class="ti ti-edit"></i>Modifier
            </button>
          </div>
        </div>
      </div>
    }
    @empty { <div class="empty-row">Aucune publication enregistrée</div> }
  </div>
}

<!-- ── Communiqué de presse ───────────────────────────────────────────── -->
@if (active()==='communique') {
  <div class="ph"><div class="pt"><i class="ti ti-file-text"></i>Rédiger un communiqué de presse</div></div>
  @if (toast.get('com')?.visible) { <div class="success-toast show" style="margin:.5rem 1rem"><i class="ti ti-check"></i>{{toast.get('com')?.message}}</div> }
  <div class="pb">
    <div class="form-grid">
      <div class="fg"><div class="fl">Titre du communiqué <span style="color:#e63946">*</span></div>
        <input class="fi" [(ngModel)]="fCom.titre" placeholder="Ex: La commune inaugure le nouveau marché municipal"></div>
      <div class="fg"><div class="fl">Sous-titre / accroche</div>
        <input class="fi" [(ngModel)]="fCom.sousTitre" placeholder="Phrase d'accroche courte"></div>
    </div>
    <div class="fg" style="margin-bottom:8px"><div class="fl">Contenu du communiqué <span style="color:#e63946">*</span></div>
      <textarea class="fi" style="height:100px;padding-top:8px;resize:vertical" [(ngModel)]="fCom.contenu" placeholder="Rédigez ici le texte du communiqué..."></textarea>
    </div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Auteur</div><input class="fi" [(ngModel)]="fCom.auteur" value="Service Communication"></div>
      <div class="fg"><div class="fl">Date de publication</div><input class="fi" type="date" [(ngModel)]="fCom.date"></div>
      <div class="fg"><div class="fl">Statut</div>
        <select class="fs" [(ngModel)]="fCom.statut">
          <option value="brouillon">Brouillon</option><option value="publie">Publier immédiatement</option>
        </select>
      </div>
    </div>
    <div class="fa">
      <button class="btn-s" (click)="resetCom()"><i class="ti ti-x"></i>Effacer</button>
      <button class="btn-p" [disabled]="saving()" (click)="publierCommunique()">
        @if (saving()) { <i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Envoi… }
        @else { <i class="ti ti-send"></i>Publier le communiqué }
      </button>
    </div>
  </div>
}

<!-- ── Annonce ────────────────────────────────────────────────────────── -->
@if (active()==='annonce') {
  <div class="ph"><div class="pt"><i class="ti ti-speakerphone"></i>Créer une annonce officielle</div></div>
  @if (toast.get('ann')?.visible) { <div class="success-toast show" style="margin:.5rem 1rem"><i class="ti ti-check"></i>{{toast.get('ann')?.message}}</div> }
  <div class="pb">
    <div class="form-grid">
      <div class="fg"><div class="fl">Titre de l'annonce <span style="color:#e63946">*</span></div>
        <input class="fi" [(ngModel)]="fAnn.titre" placeholder="Ex: Collecte des impôts — Rappel délai"></div>
      <div class="fg"><div class="fl">Catégorie</div>
        <select class="fs" [(ngModel)]="fAnn.categorie">
          <option>Fiscal / Taxes</option><option>Recrutement</option><option>Travaux / Voirie</option>
          <option>Santé publique</option><option>Culture / Fête</option><option>Autre</option>
        </select>
      </div>
    </div>
    <div class="fg" style="margin-bottom:8px"><div class="fl">Contenu <span style="color:#e63946">*</span></div>
      <textarea class="fi" style="height:80px;padding-top:8px;resize:vertical" [(ngModel)]="fAnn.contenu" placeholder="Corps de l'annonce..."></textarea>
    </div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Date début affichage</div><input class="fi" type="date" [(ngModel)]="fAnn.dateDebut"></div>
      <div class="fg"><div class="fl">Date fin affichage</div><input class="fi" type="date" [(ngModel)]="fAnn.dateFin"></div>
      <div class="fg"><div class="fl">Priorité</div>
        <select class="fs" [(ngModel)]="fAnn.priorite">
          <option value="normale">Normale</option><option value="importante">Importante</option><option value="urgente">Urgente</option>
        </select>
      </div>
    </div>
    <div class="fa">
      <button class="btn-s" (click)="fAnn.titre='';fAnn.contenu=''"><i class="ti ti-x"></i>Effacer</button>
      <button class="btn-p" [disabled]="saving()" (click)="publierAnnonce()"><i class="ti ti-send"></i>Publier l'annonce</button>
    </div>
  </div>
}

<!-- ── Événement ──────────────────────────────────────────────────────── -->
@if (active()==='evenement') {
  <div class="ph"><div class="pt"><i class="ti ti-calendar-event"></i>Créer un événement</div></div>
  @if (toast.get('evt')?.visible) { <div class="success-toast show" style="margin:.5rem 1rem"><i class="ti ti-check"></i>{{toast.get('evt')?.message}}</div> }
  <div class="pb">
    <div class="form-grid">
      <div class="fg"><div class="fl">Nom de l'événement <span style="color:#e63946">*</span></div>
        <input class="fi" [(ngModel)]="fEvt.titre" placeholder="Ex: Fête du 7 décembre"></div>
      <div class="fg"><div class="fl">Lieu</div>
        <input class="fi" [(ngModel)]="fEvt.lieu" placeholder="Ex: Place de la République"></div>
    </div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Date <span style="color:#e63946">*</span></div><input class="fi" type="date" [(ngModel)]="fEvt.date"></div>
      <div class="fg"><div class="fl">Heure début</div><input class="fi" type="time" [(ngModel)]="fEvt.hDebut"></div>
      <div class="fg"><div class="fl">Heure fin</div><input class="fi" type="time" [(ngModel)]="fEvt.hFin"></div>
    </div>
    <div class="fg" style="margin-bottom:8px"><div class="fl">Description</div>
      <textarea class="fi" style="height:70px;padding-top:8px;resize:vertical" [(ngModel)]="fEvt.description" placeholder="Programme et description..."></textarea>
    </div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Organisateur</div><input class="fi" [(ngModel)]="fEvt.organisateur" placeholder="Ex: Mairie"></div>
      <div class="fg"><div class="fl">Public cible</div>
        <select class="fs" [(ngModel)]="fEvt.publicCible">
          <option>Tous les citoyens</option><option>Jeunes</option><option>Femmes</option>
          <option>Commerçants</option><option>Agents municipaux</option>
        </select>
      </div>
    </div>
    <div class="fa">
      <button class="btn-s" (click)="fEvt.titre='';fEvt.lieu='';fEvt.description=''"><i class="ti ti-x"></i>Effacer</button>
      <button class="btn-p" [disabled]="saving()" (click)="publierEvenement()"><i class="ti ti-calendar-check"></i>Publier l'événement</button>
    </div>
  </div>
}
</div>
  `
})
export class ActualitesComponent implements OnInit {
  readonly com   = inject(CommunicationService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('liste');
  saving = signal(false);
  flt = { search: '', type: '', statut: '' };
  fCom = { titre:'', sousTitre:'', contenu:'', auteur:'Service Communication', date:'', statut:'brouillon' };
  fAnn = { titre:'', categorie:'Fiscal / Taxes', contenu:'', dateDebut:'', dateFin:'', priorite:'normale' };
  fEvt = { titre:'', lieu:'', date:'', hDebut:'', hFin:'', description:'', organisateur:'Mairie', publicCible:'Tous les citoyens' };

  tabs = [
    { id: 'liste' as Tab,      label: 'Toutes les publications', icon: 'ti-list' },
    { id: 'communique' as Tab, label: 'Communiqué',              icon: 'ti-file-text' },
    { id: 'annonce' as Tab,    label: 'Annonce',                 icon: 'ti-speakerphone' },
    { id: 'evenement' as Tab,  label: 'Événement',               icon: 'ti-calendar-event' },
  ];

  ngOnInit(): void { this.com.loadActualites(); }

  typeColor(t: string): string { return TYPE_COLORS[t] ?? '#888'; }
  chipStatut(s: string): string { return s === 'publie' ? 'cv' : 'cp'; }

  publierDirectement(id: string): void { this.com.publierDirectement(id); }

  exportActualites(): void {
    const blob = new Blob([JSON.stringify(this.com.actualites(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `actualites_${new Date().toISOString().slice(0, 10)}.json`; a.click();
  }

  publierCommunique(): void {
    if (!this.fCom.titre || !this.fCom.contenu) { this.toast.show('com', 'Titre et contenu obligatoires'); return; }
    this.saving.set(true);
    this.com.publierActualite({ type: 'communique', titre: this.fCom.titre, contenu: this.fCom.contenu, auteur: this.fCom.auteur, statut: this.fCom.statut, date: this.fCom.date || new Date().toISOString().slice(0,10) }).subscribe({
      next: a => { this.toast.show('com', (a.statut==='publie'?'Publié : ':'Brouillon : ')+a.titre); this.saving.set(false); this.resetCom(); },
      error: () => this.saving.set(false)
    });
  }

  publierAnnonce(): void {
    if (!this.fAnn.titre || !this.fAnn.contenu) { this.toast.show('ann', 'Titre et contenu obligatoires'); return; }
    this.saving.set(true);
    this.com.publierActualite({ type: 'annonce', titre: this.fAnn.titre, contenu: this.fAnn.contenu, auteur: 'Service Communication', statut: 'publie', categorie: this.fAnn.categorie }).subscribe({
      next: a => { this.toast.show('ann', 'Annonce publiée : '+a.titre); this.saving.set(false); this.fAnn.titre=''; this.fAnn.contenu=''; },
      error: () => this.saving.set(false)
    });
  }

  publierEvenement(): void {
    if (!this.fEvt.titre || !this.fEvt.date) { this.toast.show('evt', 'Titre et date obligatoires'); return; }
    this.saving.set(true);
    const contenu = `${this.fEvt.description || ''} | Lieu: ${this.fEvt.lieu || '—'} | ${this.fEvt.hDebut||''}${this.fEvt.hFin?' – '+this.fEvt.hFin:''} | Public: ${this.fEvt.publicCible}`;
    this.com.publierActualite({ type: 'evenement', titre: this.fEvt.titre, contenu, auteur: this.fEvt.organisateur, statut: 'publie', date: this.fEvt.date }).subscribe({
      next: a => { this.toast.show('evt', 'Événement publié : '+a.titre); this.saving.set(false); this.fEvt = { titre:'', lieu:'', date:'', hDebut:'', hFin:'', description:'', organisateur:'Mairie', publicCible:'Tous les citoyens' }; },
      error: () => this.saving.set(false)
    });
  }

  resetCom(): void { this.fCom = { titre:'', sousTitre:'', contenu:'', auteur:'Service Communication', date:'', statut:'brouillon' }; }
}
