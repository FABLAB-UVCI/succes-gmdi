import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationService } from '../../../../core/services/communication.service';
import { ToastService } from '../../../../core/services/toast.service';
import { RelationsApiService } from '../../../../core/services/communication-api.service';

type Tab = 'partenaires' | 'presse' | 'medias';

@Component({
  selector: 'app-relations',
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

<!-- ── Partenaires ────────────────────────────────────────────────────── -->
@if (active()==='partenaires') {
  <div class="ph"><div class="pt"><i class="ti ti-handshake"></i>Gestion des partenaires</div></div>
  @if (toast.get('part')?.visible) { <div class="success-toast show" style="margin:.5rem 1rem"><i class="ti ti-check"></i>{{toast.get('part')?.message}}</div> }
  <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="fsec">Nouveau partenaire</div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Nom de l'organisation <span style="color:#e63946">*</span></div><input class="fi" [(ngModel)]="fPart.nom" placeholder="Ex: ONG Vie Citoyenne CI"></div>
      <div class="fg"><div class="fl">Type</div>
        <select class="fs" [(ngModel)]="fPart.type">
          <option>ONG / Association</option><option>Institution publique</option>
          <option>Entreprise privée</option><option>Ambassade / Consulat</option><option>Organisation internationale</option>
        </select>
      </div>
      <div class="fg"><div class="fl">Contact principal</div><input class="fi" [(ngModel)]="fPart.contact" placeholder="Nom et téléphone"></div>
    </div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Domaine de partenariat</div><input class="fi" [(ngModel)]="fPart.domaine" placeholder="Ex: Santé, Éducation, Infrastructure..."></div>
      <div class="fg"><div class="fl">Date de début</div><input class="fi" type="date" [(ngModel)]="fPart.dateDebut"></div>
    </div>
    <div class="fa"><button class="btn-p" [disabled]="saving()" (click)="ajouterPartenaire()"><i class="ti ti-check"></i>Enregistrer</button></div>
  </div>
  <div class="pb">
    <div class="fsec" style="margin-top:0">Partenaires actifs</div>
    <div class="tbl-wrap">
      <table>
        <thead><tr><th>Organisation</th><th>Type</th><th>Domaine</th><th>Contact</th><th>Depuis</th><th>Statut</th></tr></thead>
        <tbody>
          @for (p of com.partenaires(); track p.id) {
            <tr>
              <td style="font-weight:500">{{p.nom}}</td>
              <td><span class="chip cm">{{p.type}}</span></td>
              <td>{{p.domaine}}</td>
              <td style="font-size:11px">{{p.contact}}</td>
              <td>{{p.dateDebut}}</td>
              <td><span class="chip cv">Actif</span></td>
            </tr>
          }
          @empty { <tr><td colspan="6" class="empty-row">Aucun partenaire enregistré</td></tr> }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Presse ──────────────────────────────────────────────────────────── -->
@if (active()==='presse') {
  <div class="ph"><div class="pt"><i class="ti ti-news"></i>Relations presse</div></div>
  @if (toast.get('press')?.visible) { <div class="success-toast show" style="margin:.5rem 1rem"><i class="ti ti-check"></i>{{toast.get('press')?.message}}</div> }
  <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="fsec">Envoyer un dossier de presse</div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Titre du dossier <span style="color:#e63946">*</span></div><input class="fi" [(ngModel)]="fDP.titre" placeholder="Ex: Bilan municipal 2025 — S1"></div>
      <div class="fg"><div class="fl">Médias destinataires</div><input class="fi" [(ngModel)]="fDP.medias" placeholder="Ex: RTI, FRATERNITE MATIN, NCI..."></div>
    </div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Date d'envoi</div><input class="fi" type="date" [(ngModel)]="fDP.date"></div>
      <div class="fg"><div class="fl">Contact presse</div><input class="fi" [(ngModel)]="fDP.contact" placeholder="Responsable communication"></div>
    </div>
    <div class="fa"><button class="btn-p" [disabled]="saving()" (click)="envoyerDP()"><i class="ti ti-send"></i>Envoyer le dossier</button></div>
  </div>
  <div class="pb">
    <div class="fsec" style="margin-top:0">Revue de presse récente</div>
    <div class="tbl-wrap">
      <table>
        <thead><tr><th>Date</th><th>Média</th><th>Titre de l'article</th><th>Type</th><th>Tonalité</th></tr></thead>
        <tbody>
          @for (a of revuePresse; track a.id) {
            <tr>
              <td>{{a.date}}</td>
              <td style="font-weight:500">{{a.media}}</td>
              <td>{{a.titre}}</td>
              <td><span class="chip ci">{{a.type}}</span></td>
              <td><span class="chip" [ngClass]="chipTon(a.tonalite)">{{a.tonalite}}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Médias ──────────────────────────────────────────────────────────── -->
@if (active()==='medias') {
  <div class="ph"><div class="pt"><i class="ti ti-microphone"></i>Gestion des relations médias</div></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:.75rem 1rem;border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="mini-kpi"><span class="mk-v" style="color:#F77F00">28</span><span class="mk-l">Médias référencés</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#009A44">12</span><span class="mk-l">Articles positifs ce mois</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#F77F00">4</span><span class="mk-l">Articles mitigés</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#185FA5">6</span><span class="mk-l">Demandes d'interview</span></div>
  </div>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Média</th><th>Type</th><th>Audience</th><th>Contact journaliste</th><th>Accrédité</th></tr></thead>
      <tbody>
        @for (m of medias; track m.nom) {
          <tr>
            <td style="font-weight:500">{{m.nom}}</td>
            <td><span class="chip" [ngClass]="chipMedia(m.type)">{{m.type}}</span></td>
            <td>{{m.audience}}</td>
            <td style="font-size:11px">{{m.contact}}</td>
            <td><span class="chip cv">Oui</span></td>
          </tr>
        }
      </tbody>
    </table>
  </div>
}
</div>
  `
})
export class RelationsComponent implements OnInit {
  readonly com   = inject(CommunicationService);
  readonly toast = inject(ToastService);
  private relApi = inject(RelationsApiService);
  active = signal<Tab>('partenaires');
  saving = signal(false);
  fPart = { nom:'', type:'ONG / Association', contact:'', domaine:'', dateDebut:'' };
  fDP   = { titre:'', medias:'', date:'', contact:'' };

  revuePresse = [
    { id:'1', date:'24/05/2025', media:'RTI 1', titre:'La commune inaugure son nouveau marché municipal', type:'TV', tonalite:'Positive' },
    { id:'2', date:'23/05/2025', media:'Fraternité Matin', titre:'Budget rectificatif 2025 adopté par le Conseil', type:'Presse écrite', tonalite:'Neutre' },
    { id:'3', date:'21/05/2025', media:'NCI', titre:'Collecte des ordures : les points noirs identifiés', type:'TV', tonalite:'Mitigée' },
    { id:'4', date:'18/05/2025', media:'Radio Nationale', titre:'Interview du Maire — Bilan travaux voirie', type:'Radio', tonalite:'Positive' },
  ];
  medias = [
    { nom:'RTI 1', type:'Télévision', audience:'2,4M viewers', contact:'KOUAME Alain — 07 00 11 22' },
    { nom:'NCI', type:'Télévision', audience:'1,1M viewers', contact:'BROU Koffi — 07 00 33 44' },
    { nom:'Fraternité Matin', type:'Presse écrite', audience:'45 000 lecteurs', contact:'TRAORÉ Seydou — 27 20 55 66' },
    { nom:'Radio Nationale', type:'Radio', audience:'800 000 auditeurs', contact:'OUATTARA Hadja — 07 00 77 88' },
    { nom:'Abidjan.net', type:'Web', audience:'120 000 UV/j', contact:'redaction@abidjan.net' },
  ];

  tabs = [
    { id: 'partenaires' as Tab, label: 'Partenaires', icon: 'ti-handshake' },
    { id: 'presse' as Tab,      label: 'Presse',      icon: 'ti-news' },
    { id: 'medias' as Tab,      label: 'Médias',      icon: 'ti-microphone' },
  ];

  ngOnInit(): void { this.com.loadPartenaires(); }

  ajouterPartenaire(): void {
    if (!this.fPart.nom) { this.toast.show('part', "Nom de l'organisation obligatoire"); return; }
    this.saving.set(true);
    this.com.ajouterPartenaire({ nom: this.fPart.nom, type: this.fPart.type, domaine: this.fPart.domaine || '—', contact: this.fPart.contact || '—', date_debut: this.fPart.dateDebut || new Date().toISOString().slice(0,10) }).subscribe({
      next: p => { this.toast.show('part', 'Partenaire enregistré — '+p.nom); this.saving.set(false); this.fPart = { nom:'', type:'ONG / Association', contact:'', domaine:'', dateDebut:'' }; },
      error: () => this.saving.set(false)
    });
  }

  envoyerDP(): void {
    if (!this.fDP.titre) { this.toast.show('press', 'Titre du dossier obligatoire'); return; }
    this.saving.set(true);
    this.relApi.envoyerDossierPresse({ titre: this.fDP.titre, medias: this.fDP.medias, date_envoi: this.fDP.date || new Date().toISOString().slice(0,10), contact: this.fDP.contact }).subscribe({
      next: () => { this.toast.show('press', 'Dossier de presse envoyé — '+this.fDP.titre); this.saving.set(false); this.fDP = { titre:'', medias:'', date:'', contact:'' }; },
      error: () => this.saving.set(false)
    });
  }

  chipTon(t: string): string { return { Positive:'cv', Neutre:'cm', Mitigée:'cp', Négative:'ce' }[t] ?? 'cn'; }
  chipMedia(t: string): string { return { Télévision:'ci', Radio:'cg', 'Presse écrite':'co', Web:'cbl' }[t] ?? 'cm'; }
}
