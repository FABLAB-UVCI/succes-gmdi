import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrbanismeService } from '../../../../core/services/urbanisme.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TypePermis } from '../../../../core/models/urbanisme.models';

type Tab = 'liste' | 'nouveau' | 'suivi';

const TYPES_PERMIS: { val: TypePermis | 'occupation'; label: string; icon: string; code: string }[] = [
  { val: 'construire',  label: 'Permis de construire',     icon: 'ti-building-plus',  code: 'PC'  },
  { val: 'demolir',     label: 'Permis de démolir',        icon: 'ti-building-minus', code: 'PD'  },
  { val: 'certificat',  label: "Certificat d'urbanisme",   icon: 'ti-certificate',    code: 'CU'  },
  { val: 'occupation',  label: "Autorisation d'occupation",icon: 'ti-home-check',     code: 'AO'  },
];

@Component({
  selector: 'app-permis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="tabs">
  @for (t of tabs; track t.id) {
    <div class="tab" [class.act]="active()===t.id" (click)="active.set(t.id)">
      <i class="ti {{t.icon}}"></i>{{t.label}}
      @if (t.id==='suivi' && enInstruction() > 0) {
        <span class="badge">{{enInstruction()}}</span>
      }
    </div>
  }
</div>
<div class="panel notop">

<!-- ── Cartes types de permis ─────────────────────────────────────────── -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:.75rem 1rem;border-bottom:.5px solid var(--color-border-tertiary)">
  @for (tp of typesPermis; track tp.val) {
    <div class="type-card" [class.act]="flt.type===tp.val" (click)="flt.type=(flt.type===tp.val ? '' : tp.val); urb.loadPermis({type:flt.type})">
      <i class="ti {{tp.icon}}" style="font-size:20px;color:#F47920;margin-bottom:4px"></i>
      <div style="font-size:11px;font-weight:500;color:var(--color-text-primary)">{{tp.label}}</div>
      <div style="font-size:18px;font-weight:500;color:#F47920">{{countType(tp.val)}}</div>
    </div>
  }
</div>

<!-- ── Liste des permis ───────────────────────────────────────────────── -->
@if (active()==='liste') {
  <div class="ph">
    <div class="pt"><i class="ti ti-list"></i>Tous les permis et autorisations</div>
    <div style="display:flex;gap:8px">
      <select class="fs" style="max-width:130px" [(ngModel)]="flt.statut" (ngModelChange)="urb.loadPermis({statut:flt.statut})">
        <option value="">Tous statuts</option>
        <option value="depose">Déposé</option><option value="instruction">En instruction</option>
        <option value="accorde">Accordé</option><option value="refuse">Refusé</option><option value="expire">Expiré</option>
      </select>
      <button class="btn-p" (click)="active.set('nouveau')"><i class="ti ti-plus"></i>Nouvelle demande</button>
    </div>
  </div>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Référence</th><th>Type</th><th>Demandeur</th><th>Localisation</th><th>Date dépôt</th><th>Surface</th><th>Agent</th><th>Statut</th><th>Action</th></tr></thead>
      <tbody>
        @for (p of urb.permis(); track p.id) {
          <tr>
            <td class="mono-td">{{p.reference}}</td>
            <td><span class="chip cm" style="font-size:10px">{{labelType(p.type ?? '')}}</span></td>
            <td style="font-weight:500">{{p.demandeur}}</td>
            <td>{{p.localisation}}</td>
            <td>{{p.dateDepot}}</td>
            <td>{{p.surfacePlancher ? (p.surfacePlancher | number) + ' m²' : '—'}}</td>
            <td>{{p.agent || '—'}}</td>
            <td><span class="chip" [ngClass]="chipStatut(p.statut)">{{p.statut}}</span></td>
            <td>
              @if (p.statut==='depose' || p.statut==='instruction') {
                <div style="display:flex;gap:4px">
                  <button class="btn-s" style="padding:3px 8px;font-size:11px;color:#009A44;border-color:#009A44" (click)="accorder(p.id)">
                    <i class="ti ti-check"></i>Accorder
                  </button>
                  <button class="btn-s" style="padding:3px 8px;font-size:11px;color:#e63946;border-color:#e63946" (click)="refuser(p.id)">
                    <i class="ti ti-x"></i>Refuser
                  </button>
                </div>
              }
            </td>
          </tr>
        }
        @empty { <tr><td colspan="9" class="empty-row">Aucun permis enregistré</td></tr> }
      </tbody>
    </table>
  </div>
}

<!-- ── Nouvelle demande ───────────────────────────────────────────────── -->
@if (active()==='nouveau') {
  <div class="ph"><div class="pt"><i class="ti ti-file-plus"></i>Enregistrer une demande de permis</div></div>
  <div class="pb">
    <div class="fsec">Type de permis / autorisation</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px">
      @for (tp of typesPermis; track tp.val) {
        <div class="type-card" [class.act]="fDem.type===tp.val" (click)="setType(tp.val)" style="cursor:pointer">
          <i class="ti {{tp.icon}}" style="font-size:18px;color:#F47920;margin-bottom:4px"></i>
          <div style="font-size:11px;font-weight:500">{{tp.label}}</div>
        </div>
      }
    </div>

    <div class="fsec">Informations du demandeur</div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Nom du demandeur</div><input class="fi" [(ngModel)]="fDem.demandeur" placeholder="Nom complet ou raison sociale"></div>
      <div class="fg"><div class="fl">Téléphone</div><input class="fi" [(ngModel)]="fDem.telephone" placeholder="07 XX XX XX XX"></div>
    </div>

    <!-- Numéro de pièce (uniquement pour permis de démolir) -->
    @if (fDem.type === 'demolir') {
      <div class="form-grid">
        <div class="fg"><div class="fl">N° Pièce d'identité</div><input class="fi" [(ngModel)]="fDem.numeroPiece" placeholder="CNI / Passeport / Titre de séjour"></div>
        <div class="fg"><div class="fl">Nature du document</div>
          <select class="fs" [(ngModel)]="fDem.typePiece">
            <option value="cni">Carte Nationale d'Identité</option>
            <option value="passeport">Passeport</option>
            <option value="sejour">Titre de séjour</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>
    }

    <div class="fsec">Localisation du projet</div>
    <div class="form-grid-4">
      <div class="fg"><div class="fl">Îlot</div><input class="fi" [(ngModel)]="fDem.ilot" placeholder="N° Îlot"></div>
      <div class="fg"><div class="fl">Lot</div><input class="fi" [(ngModel)]="fDem.lot" placeholder="N° Lot"></div>
      <div class="fg"><div class="fl">Section</div><input class="fi" [(ngModel)]="fDem.section" placeholder="Section"></div>
      <div class="fg"><div class="fl">Quartier</div><input class="fi" [(ngModel)]="fDem.quartier" placeholder="Quartier"></div>
    </div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Adresse précise</div><input class="fi" [(ngModel)]="fDem.localisation" placeholder="Adresse complète"></div>
      <div class="fg"><div class="fl">Surface de plancher (m²)</div><input class="fi" type="number" [(ngModel)]="fDem.surfacePlancher"></div>
    </div>

    <div class="fsec"><i class="ti ti-map-pin" style="font-size:11px;margin-right:4px"></i>Géolocalisation GPS</div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Latitude</div><input class="fi" type="number" step="0.000001" [(ngModel)]="fDem.lat" placeholder="Ex: 5.3600"></div>
      <div class="fg"><div class="fl">Longitude</div><input class="fi" type="number" step="0.000001" [(ngModel)]="fDem.lng" placeholder="Ex: -4.0083"></div>
    </div>

    <div class="form-grid">
      <div class="fg"><div class="fl">Agent instructeur</div><input class="fi" [(ngModel)]="fDem.agent" placeholder="Nom de l'agent chargé du dossier"></div>
    </div>

    <div class="fg" style="margin-bottom:8px"><div class="fl">Observations / Pièces requises</div>
      <textarea class="fi" style="height:65px;resize:none;padding-top:6px" [(ngModel)]="fDem.observations"></textarea>
    </div>

    <div class="fsec"><i class="ti ti-paperclip" style="font-size:11px;margin-right:4px"></i>Pièces jointes</div>
    <div class="form-grid">
      <div class="fg">
        <div class="fl">Joindre un document (PDF, image)</div>
        <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileChange($event)">
        @if (nomFichier) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{nomFichier}}</div> }
      </div>
      <div class="fg">
        <div class="fl">Document complémentaire</div>
        <input type="file" class="fi-file" accept=".pdf,.jpg,.jpeg,.png" (change)="onFileChange2($event)">
        @if (nomFichier2) { <div class="file-name"><i class="ti ti-file-check" style="font-size:11px"></i> {{nomFichier2}}</div> }
      </div>
    </div>

    <div class="fa">
      <button class="btn-s" (click)="active.set('liste')"><i class="ti ti-x"></i>Annuler</button>
      <button class="btn-p" [disabled]="saving()" (click)="enregistrerPermis()">
        @if (saving()) { <i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Enregistrement… }
        @else { <i class="ti ti-send"></i>Enregistrer la demande }
      </button>
    </div>
    @if (toast.get('per')?.visible) {
      <div class="success-toast show" style="margin-top:8px"><i class="ti ti-check"></i>{{toast.get('per')?.message}}</div>
    }
  </div>
}

<!-- ── Suivi en instruction ───────────────────────────────────────────── -->
@if (active()==='suivi') {
  <div class="ph">
    <div class="pt"><i class="ti ti-clock"></i>Dossiers en instruction</div>
    <div style="font-size:12px;color:var(--color-text-secondary)">{{enInstruction()}} dossier(s) en attente</div>
  </div>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Référence</th><th>Type</th><th>Demandeur</th><th>Localisation</th><th>Déposé le</th><th>Jours écoulés</th><th>Agent</th><th>Action</th></tr></thead>
      <tbody>
        @for (p of dossiersPendants(); track p.id) {
          <tr>
            <td class="mono-td">{{p.reference}}</td>
            <td>{{labelType(p.type ?? '')}}</td>
            <td style="font-weight:500">{{p.demandeur}}</td>
            <td>{{p.localisation}}</td>
            <td>{{p.dateDepot}}</td>
            <td>
              <span [class.date-retard]="joursEcoules(p.dateDepot) > 30">
                {{joursEcoules(p.dateDepot)}} j
              </span>
            </td>
            <td>{{p.agent || 'Non assigné'}}</td>
            <td style="display:flex;gap:4px">
              <button class="btn-s" style="padding:3px 8px;font-size:11px;color:#009A44;border-color:#009A44" (click)="accorder(p.id)">
                <i class="ti ti-check"></i>Accorder
              </button>
              <button class="btn-s" style="padding:3px 8px;font-size:11px;color:#e63946;border-color:#e63946" (click)="refuser(p.id)">
                <i class="ti ti-x"></i>Refuser
              </button>
            </td>
          </tr>
        }
        @empty { <tr><td colspan="8" class="empty-row">Aucun dossier en instruction</td></tr> }
      </tbody>
    </table>
  </div>
}

@if (toast.get('per')?.visible && active()!=='nouveau') {
  <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('per')?.message}}</div>
}
</div>
  `
})
export class PermisComponent implements OnInit {
  readonly urb   = inject(UrbanismeService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('liste');
  saving = signal(false);
  flt = { statut: '', type: '' };
  typesPermis = TYPES_PERMIS;
  nomFichier  = '';
  nomFichier2 = '';
  fDem = {
    type: 'construire' as TypePermis,
    demandeur: '', telephone: '',
    ilot: '', lot: '', section: '', quartier: '',
    localisation: '',
    numeroPiece: '', typePiece: 'cni',
    surfacePlancher: 0,
    lat: 0, lng: 0,
    agent: '', observations: ''
  };

  enInstruction = computed(() => this.urb.permis().filter(p => p.statut === 'depose' || p.statut === 'instruction').length);
  dossiersPendants = computed(() => this.urb.permis().filter(p => p.statut === 'depose' || p.statut === 'instruction'));

  tabs = [
    { id: 'liste' as Tab,    label: 'Tous les permis',       icon: 'ti-list' },
    { id: 'nouveau' as Tab,  label: 'Nouvelle demande',      icon: 'ti-file-plus' },
    { id: 'suivi' as Tab,    label: 'En instruction',        icon: 'ti-clock' },
  ];

  ngOnInit(): void { this.urb.loadPermis(); }

  countType(t: string): number { return this.urb.permis().filter(p => p.type === t).length; }
  labelType(t: string): string { return TYPES_PERMIS.find(x => x.val === t)?.label ?? t; }
  joursEcoules(date: string): number { return Math.floor((Date.now() - new Date(date).getTime()) / 86400000); }

  onFileChange(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    this.nomFichier = f?.name ?? '';
  }
  onFileChange2(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    this.nomFichier2 = f?.name ?? '';
  }

  enregistrerPermis(): void {
    if (!this.fDem.demandeur || !this.fDem.localisation) { this.toast.show('per', 'Demandeur et localisation obligatoires'); return; }
    this.saving.set(true);
    const payload = {
      ...this.fDem,
      localisation: [this.fDem.ilot, this.fDem.lot, this.fDem.section, this.fDem.quartier, this.fDem.localisation]
        .filter(Boolean).join(' — ') || this.fDem.localisation
    };
    this.urb.creerPermis(payload).subscribe({
      next: p => {
        this.toast.show('per', `Permis enregistré — ${p.reference}`);
        this.saving.set(false);
        this.fDem = { type:'construire', demandeur:'', telephone:'', ilot:'', lot:'', section:'', quartier:'', localisation:'', numeroPiece:'', typePiece:'cni', surfacePlancher:0, lat:0, lng:0, agent:'', observations:'' };
        this.nomFichier = ''; this.nomFichier2 = '';
        setTimeout(() => this.active.set('liste'), 1500);
      },
      error: () => this.saving.set(false)
    });
  }

  accorder(id: string): void {
    this.urb.updateStatutPermis(id, 'accorde').subscribe({ next: () => this.toast.show('per', 'Permis accordé'), error: () => {} });
  }
  refuser(id: string): void {
    this.urb.updateStatutPermis(id, 'refuse').subscribe({ next: () => this.toast.show('per', 'Permis refusé'), error: () => {} });
  }

  setType(val: string): void { this.fDem.type = val as TypePermis; }
  chipStatut(s: string): string { return { depose:'cm', instruction:'cp', accorde:'cv', refuse:'ce', expire:'cn' }[s] ?? 'cn'; }
}
