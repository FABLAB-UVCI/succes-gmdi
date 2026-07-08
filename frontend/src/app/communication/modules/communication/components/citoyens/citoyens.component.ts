import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationService } from '../../../../core/services/communication.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'reclamations' | 'suggestions' | 'consultations';

@Component({
  selector: 'app-citoyens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="tabs">
  @for (t of tabs; track t.id) {
    <div class="tab" [class.act]="active()===t.id" (click)="active.set(t.id)">
      <i class="ti {{t.icon}}"></i>{{t.label}}
      @if (t.id==='reclamations' && com.kpi().reclamationsOuvertes > 0) {
        <span class="badge">{{com.kpi().reclamationsOuvertes}}</span>
      }
    </div>
  }
</div>
<div class="panel notop">

<!-- ── Réclamations ───────────────────────────────────────────────────── -->
@if (active()==='reclamations') {
  <div class="ph">
    <div class="pt"><i class="ti ti-message-circle"></i>Réclamations citoyennes</div>
    <button class="btn-s" (click)="com.exportReclamations()"><i class="ti ti-download"></i>Exporter</button>
  </div>
  @if (toast.get('rec')?.visible) { <div class="show" [ngClass]="toast.get('rec')?.type==='error' ? 'error-toast' : 'success-toast'" style="margin:.5rem 1rem"><i class="ti" [ngClass]="toast.get('rec')?.type==='error' ? 'ti-alert-circle' : 'ti-check'"></i>{{toast.get('rec')?.message}}</div> }
  <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="fsec">Enregistrer une réclamation</div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Objet de la réclamation <span style="color:#e63946">*</span></div><input class="fi" [(ngModel)]="fRec.objet" placeholder="Ex: Bruit chantier nocturne"></div>
      <div class="fg"><div class="fl">Demandeur <span style="color:#e63946">*</span></div><input class="fi" [(ngModel)]="fRec.demandeur" placeholder="Nom du citoyen"></div>
    </div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Service destinataire</div>
        <select class="fs" [(ngModel)]="fRec.service">
          <option>Services Techniques</option><option>Urbanisme</option><option>Finances</option>
          <option>État Civil</option><option>Direction Générale</option>
        </select>
      </div>
      <div class="fg"><div class="fl">Canal de réception</div>
        <select class="fs" [(ngModel)]="fRec.canal">
          <option value="guichet">Guichet physique</option><option value="email">Email</option>
          <option value="rs">Réseaux sociaux</option><option value="sms">SMS</option><option value="tel">Téléphone</option>
        </select>
      </div>
    </div>
    <div class="fa"><button class="btn-p" [disabled]="saving()" (click)="ajouterReclamation()"><i class="ti ti-plus"></i>Enregistrer</button></div>
  </div>
  <div style="padding:.75rem 1rem">
    <div class="fsec" style="margin-top:0">Réclamations en cours</div>
    @for (r of com.reclamations(); track r.id) {
      <div class="rec-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
          <div>
            <div style="font-size:12px;font-weight:500">{{r.objet}}</div>
            <div style="font-size:11px;color:var(--color-text-secondary)">
              <span class="mono-td">{{r.reference}}</span> — {{r.demandeur}} — via {{r.canal}} — {{r.date}}
            </div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">→ Service : <strong>{{r.service}}</strong></div>
          </div>
          <span class="chip" [ngClass]="chipRec(r.statut)">{{r.statut}}</span>
        </div>
        <div style="display:flex;gap:5px;margin-top:6px">
          @if (r.statut==='en_traitement') {
            <button class="btn-s sm success" (click)="valider(r.id)">
              <i class="ti ti-check"></i>Marquer résolu
            </button>
          }
        </div>
      </div>
    }
    @empty { <div class="empty-row">Aucune réclamation enregistrée</div> }
  </div>
}

<!-- ── Suggestions ────────────────────────────────────────────────────── -->
@if (active()==='suggestions') {
  <div class="ph">
    <div class="pt"><i class="ti ti-bulb"></i>Boîte à idées citoyenne</div>
    <button class="btn-s" (click)="exportSug()"><i class="ti ti-download"></i>Exporter</button>
  </div>
  @if (toast.get('sug')?.visible) { <div class="show" [ngClass]="toast.get('sug')?.type==='error' ? 'error-toast' : 'success-toast'" style="margin:.5rem 1rem"><i class="ti" [ngClass]="toast.get('sug')?.type==='error' ? 'ti-alert-circle' : 'ti-check'"></i>{{toast.get('sug')?.message}}</div> }
  <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="fsec">Nouvelle suggestion</div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Objet <span style="color:#e63946">*</span></div><input class="fi" [(ngModel)]="fSug.objet" placeholder="Ex: Installer des bancs publics Place République"></div>
      <div class="fg"><div class="fl">Citoyen</div><input class="fi" [(ngModel)]="fSug.citoyen" placeholder="Nom ou anonyme"></div>
    </div>
    <div class="fg" style="margin-bottom:8px"><div class="fl">Description détaillée</div>
      <textarea class="fi" style="height:60px;padding-top:6px;resize:vertical" [(ngModel)]="fSug.description" placeholder="Détails de la suggestion..."></textarea>
    </div>
    <div class="fa"><button class="btn-p" [disabled]="saving()" (click)="ajouterSuggestion()"><i class="ti ti-plus"></i>Enregistrer</button></div>
  </div>
  <div style="padding:.75rem 1rem">
    <div class="fsec" style="margin-top:0">Suggestions reçues</div>
    @for (s of com.suggestions(); track s.id) {
      <div class="rec-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
          <div>
            <div style="font-size:12px;font-weight:500">{{s.objet}}</div>
            <div style="font-size:11px;color:var(--color-text-secondary)"><span class="mono-td">{{s.reference}}</span> — {{s.citoyen}} — {{s.date}}</div>
            @if (s.description) { <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">{{s.description}}</div> }
          </div>
          <span class="chip" [ngClass]="chipSug(s.statut)">{{s.statut}}</span>
        </div>
        <div style="margin-top:6px">
          <button class="btn-s sm edit" (click)="transmettre(s.id)">
            <i class="ti ti-send"></i>Transmettre au service
          </button>
        </div>
      </div>
    }
    @empty { <div class="empty-row">Aucune suggestion enregistrée</div> }
  </div>
}

<!-- ── Consultations publiques ────────────────────────────────────────── -->
@if (active()==='consultations') {
  <div class="ph"><div class="pt"><i class="ti ti-users-group"></i>Consultations publiques</div></div>
  @if (toast.get('cons')?.visible) { <div class="show" [ngClass]="toast.get('cons')?.type==='error' ? 'error-toast' : 'success-toast'" style="margin:.5rem 1rem"><i class="ti" [ngClass]="toast.get('cons')?.type==='error' ? 'ti-alert-circle' : 'ti-check'"></i>{{toast.get('cons')?.message}}</div> }
  <div class="pb" style="border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="fsec">Ouvrir une consultation publique</div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Sujet <span style="color:#e63946">*</span></div><input class="fi" [(ngModel)]="fCons.titre" placeholder="Ex: Avis sur le nouveau Plan Local d'Urbanisme"></div>
      <div class="fg"><div class="fl">Thématique</div>
        <select class="fs" [(ngModel)]="fCons.theme">
          <option>Urbanisme / Aménagement</option><option>Budget / Finances</option>
          <option>Environnement</option><option>Social / Éducation</option><option>Mobilité / Transport</option>
        </select>
      </div>
    </div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Date d'ouverture <span style="color:#e63946">*</span></div><input class="fi" type="date" [(ngModel)]="fCons.dateOuv"></div>
      <div class="fg"><div class="fl">Date de clôture <span style="color:#e63946">*</span></div><input class="fi" type="date" [(ngModel)]="fCons.dateClt"></div>
      <div class="fg"><div class="fl">Canaux</div>
        <select class="fs" [(ngModel)]="fCons.canaux">
          <option>En ligne + Physique</option><option>En ligne uniquement</option><option>Réunion publique</option>
        </select>
      </div>
    </div>
    <div class="fa"><button class="btn-p" [disabled]="saving()" (click)="ouvrirConsultation()"><i class="ti ti-check"></i>Ouvrir la consultation</button></div>
  </div>
  <div class="pb">
    <div class="fsec" style="margin-top:0">Consultations actives</div>
    <div class="tbl-wrap">
      <table>
        <thead><tr><th>Sujet</th><th>Thématique</th><th>Ouverture</th><th>Clôture</th><th>Participants</th><th>Statut</th></tr></thead>
        <tbody>
          @for (c of com.consultations(); track c.id) {
            <tr>
              <td style="font-weight:500">{{c.titre}}</td>
              <td><span class="chip cm">{{c.theme}}</span></td>
              <td>{{c.dateOuverture}}</td>
              <td>{{c.dateCloture}}</td>
              <td>{{c.participants | number}}</td>
              <td><span class="chip" [ngClass]="chipCons(c.statut)">{{c.statut}}</span></td>
            </tr>
          }
          @empty { <tr><td colspan="6" class="empty-row">Aucune consultation</td></tr> }
        </tbody>
      </table>
    </div>
  </div>
}
</div>

<style>
.rec-card { border:.5px solid var(--color-border-tertiary);border-radius:8px;padding:.75rem;margin-bottom:.4rem; }
</style>
  `
})
export class CitoyensComponent implements OnInit {
  readonly com   = inject(CommunicationService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('reclamations');
  saving = signal(false);
  fRec  = { objet:'', demandeur:'', service:'Services Techniques', canal:'guichet' };
  fSug  = { objet:'', citoyen:'', description:'' };
  fCons = { titre:'', theme:'Urbanisme / Aménagement', dateOuv:'', dateClt:'', canaux:'En ligne + Physique' };

  tabs = [
    { id: 'reclamations' as Tab,  label: 'Réclamations',       icon: 'ti-message-circle' },
    { id: 'suggestions' as Tab,   label: 'Suggestions',        icon: 'ti-bulb' },
    { id: 'consultations' as Tab, label: 'Consultations pub.', icon: 'ti-users-group' },
  ];

  ngOnInit(): void { this.com.loadReclamations(); this.com.loadSuggestions(); this.com.loadConsultations(); }

  ajouterReclamation(): void {
    if (!this.fRec.objet || !this.fRec.demandeur) { this.toast.showError('rec', 'Objet et demandeur obligatoires'); return; }
    this.saving.set(true);
    this.com.ajouterReclamation(this.fRec).subscribe({
      next: r => { this.toast.show('rec', 'Réclamation enregistrée — '+r.reference); this.saving.set(false); this.fRec = { objet:'', demandeur:'', service:'Services Techniques', canal:'guichet' }; },
      error: (err) => { this.saving.set(false); this.toast.showError('rec', err?.error?.message || 'Une erreur est survenue.'); }
    });
  }

  valider(id: string): void { this.com.validerReclamation(id); this.toast.show('rec', 'Réclamation marquée comme répondue'); }

  ajouterSuggestion(): void {
    if (!this.fSug.objet) { this.toast.showError('sug', 'Objet obligatoire'); return; }
    this.saving.set(true);
    this.com.ajouterSuggestion({ objet: this.fSug.objet, citoyen: this.fSug.citoyen || 'Anonyme', description: this.fSug.description }).subscribe({
      next: s => { this.toast.show('sug', 'Suggestion enregistrée — '+s.reference); this.saving.set(false); this.fSug = { objet:'', citoyen:'', description:'' }; },
      error: (err) => { this.saving.set(false); this.toast.showError('sug', err?.error?.message || 'Une erreur est survenue.'); }
    });
  }

  transmettre(id: string): void { this.com.transmettresuggestion(id); this.toast.show('sug', 'Suggestion transmise au service concerné'); }

  exportSug(): void {
    const blob = new Blob([JSON.stringify(this.com.suggestions(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `suggestions_${new Date().toISOString().slice(0, 10)}.json`; a.click();
  }

  ouvrirConsultation(): void {
    if (!this.fCons.titre || !this.fCons.dateOuv || !this.fCons.dateClt) { this.toast.showError('cons', "Titre et dates obligatoires"); return; }
    this.saving.set(true);
    this.com.ouvrirConsultation({ titre: this.fCons.titre, theme: this.fCons.theme, date_ouverture: this.fCons.dateOuv, date_cloture: this.fCons.dateClt, canaux: this.fCons.canaux }).subscribe({
      next: c => { this.toast.show('cons', 'Consultation ouverte — '+c.titre); this.saving.set(false); this.fCons = { titre:'', theme:'Urbanisme / Aménagement', dateOuv:'', dateClt:'', canaux:'En ligne + Physique' }; },
      error: (err) => { this.saving.set(false); this.toast.showError('cons', err?.error?.message || 'Une erreur est survenue.'); }
    });
  }

  chipRec(s: string): string  { return { en_traitement:'cp', repondu:'cv', cloture:'cn' }[s] ?? 'cp'; }
  chipSug(s: string): string  { return { recu:'cm', en_etude:'ci', transmis:'cv', rejete:'ce' }[s] ?? 'cm'; }
  chipCons(s: string): string { return { programme:'ci', actif:'cv', cloture:'cn' }[s] ?? 'cm'; }
}
