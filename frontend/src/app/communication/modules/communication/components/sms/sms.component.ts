import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationService } from '../../../../core/services/communication.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'alerte' | 'campagne' | 'historique';

const NB_DEST: Record<string, number> = { tous: 12500, quartier: 3800, commercants: 2400, agents: 347, contribuables: 8200 };

@Component({
  selector: 'app-sms',
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

<!-- ── Alertes ────────────────────────────────────────────────────────── -->
@if (active()==='alerte') {
  <div class="ph"><div class="pt"><i class="ti ti-bell"></i>Envoyer une alerte urgente</div></div>
  @if (toast.get('alt')?.visible) { <div class="success-toast show" style="margin:.5rem 1rem"><i class="ti ti-check"></i>{{toast.get('alt')?.message}}</div> }
  <div class="pb">
    <div class="fsec">Alerte d'urgence ou information critique</div>
    <div class="fg" style="margin-bottom:6px">
      <div class="fl">Message d'alerte <span style="color:#e63946">*</span></div>
      <textarea class="fi" style="height:90px;padding-top:8px;resize:vertical" [(ngModel)]="fAlt.message" (ngModelChange)="altCount=fAlt.message.length" placeholder="Ex: MAIRIE — Des travaux nécessitent la fermeture de l'Av. Houphouët-Boigny du 28 au 30 mai..."></textarea>
    </div>
    <div style="font-size:10px;color:var(--color-text-secondary);text-align:right;margin-bottom:8px">{{altCount}} / 160 caractères</div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Groupe cible <span style="color:#e63946">*</span></div>
        <select class="fs" [(ngModel)]="fAlt.cible">
          <option value="">-- Choisir --</option>
          <option value="tous">Tous les abonnés (12 500)</option>
          <option value="quartier">Par quartier</option>
          <option value="commercants">Commerçants (2 400)</option>
          <option value="agents">Agents municipaux (347)</option>
        </select>
      </div>
      <div class="fg"><div class="fl">Quartier (si applicable)</div>
        <select class="fs" [(ngModel)]="fAlt.quartier">
          <option value="">Tous les quartiers</option>
          <option>Cocody</option><option>Abobo</option><option>Yopougon</option><option>Adjamé</option>
        </select>
      </div>
      <div class="fg"><div class="fl">Priorité</div>
        <select class="fs" [(ngModel)]="fAlt.priorite">
          <option value="normale">Normale</option><option value="haute">Haute</option><option value="urgente">URGENTE</option>
        </select>
      </div>
    </div>
    <div class="fa">
      <button class="btn-s" (click)="fAlt.message='';altCount=0"><i class="ti ti-x"></i>Effacer</button>
      <button class="btn-p" [disabled]="saving()" (click)="envoyerAlerte()">
        @if (saving()) { <i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i>Envoi… }
        @else { <i class="ti ti-bell"></i>Envoyer l'alerte }
      </button>
    </div>
  </div>
}

<!-- ── Campagnes ──────────────────────────────────────────────────────── -->
@if (active()==='campagne') {
  <div class="ph"><div class="pt"><i class="ti ti-send"></i>Créer une campagne SMS</div></div>
  @if (toast.get('camp')?.visible) { <div class="success-toast show" style="margin:.5rem 1rem"><i class="ti ti-check"></i>{{toast.get('camp')?.message}}</div> }
  <div class="pb">
    <div class="form-grid">
      <div class="fg"><div class="fl">Nom de la campagne <span style="color:#e63946">*</span></div>
        <input class="fi" [(ngModel)]="fCamp.nom" placeholder="Ex: Rappel taxe résidence 2025"></div>
      <div class="fg"><div class="fl">Type</div>
        <select class="fs" [(ngModel)]="fCamp.type">
          <option value="info">Information générale</option><option value="fiscal">Avis fiscal / Taxes</option>
          <option value="sante">Santé publique</option><option value="travaux">Travaux / Perturbations</option>
          <option value="evenement">Événement</option>
        </select>
      </div>
    </div>
    <div class="fg" style="margin-bottom:6px">
      <div class="fl">Message SMS <span style="color:#e63946">*</span></div>
      <textarea class="fi" style="height:80px;padding-top:8px;resize:vertical" [(ngModel)]="fCamp.message" (ngModelChange)="campCount=fCamp.message.length" placeholder="Ex: MAIRIE — Votre taxe de résidence 2025 est due avant le 30 juin. Payez via Orange Money au 1234 ou à la mairie."></textarea>
    </div>
    <div style="font-size:10px;color:var(--color-text-secondary);text-align:right;margin-bottom:8px">{{campCount}} / 160 caractères</div>
    <div class="form-grid-3">
      <div class="fg"><div class="fl">Destinataires <span style="color:#e63946">*</span></div>
        <select class="fs" [(ngModel)]="fCamp.dest">
          <option value="">-- Choisir --</option>
          <option value="tous">Tous les abonnés (12 500)</option>
          <option value="contribuables">Contribuables (8 200)</option>
          <option value="commercants">Commerçants (2 400)</option>
          <option value="agents">Agents municipaux (347)</option>
        </select>
      </div>
      <div class="fg"><div class="fl">Date d'envoi</div>
        <select class="fs" [(ngModel)]="fCamp.quand">
          <option value="maintenant">Maintenant</option><option value="programme">Programmer</option>
        </select>
      </div>
      @if (fCamp.quand==='programme') {
        <div class="fg"><div class="fl">Date / Heure programmée</div><input class="fi" type="datetime-local" [(ngModel)]="fCamp.dateHeure"></div>
      }
    </div>
    @if (fCamp.dest) {
      <div style="background:#fdf6e3;border:.5px solid #F77F00;border-radius:6px;padding:8px 12px;font-size:12px;margin-bottom:8px">
        <i class="ti ti-info-circle" style="color:#F77F00;margin-right:6px"></i>
        <strong>{{nbDest(fCamp.dest) | number}}</strong> destinataires — Coût estimé : <strong>{{coutEstime(fCamp.dest) | number}} FCFA</strong>
      </div>
    }
    <div class="fa">
      <button class="btn-s" (click)="fCamp.nom='';fCamp.message='';campCount=0"><i class="ti ti-x"></i>Effacer</button>
      <button class="btn-p" [disabled]="saving()" (click)="lancerCampagne()"><i class="ti ti-send"></i>Lancer la campagne</button>
    </div>
  </div>
}

<!-- ── Historique ──────────────────────────────────────────────────────── -->
@if (active()==='historique') {
  <div class="ph">
    <div class="pt"><i class="ti ti-history"></i>Historique des envois SMS</div>
    <button class="btn-s" (click)="com.exportSms()"><i class="ti ti-download"></i>Exporter</button>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:.75rem 1rem;border-bottom:.5px solid var(--color-border-tertiary)">
    <div class="mini-kpi"><span class="mk-v" style="color:#F77F00">{{com.smsHistorique().length}}</span><span class="mk-l">Campagnes ce mois</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#003366">{{totalSms() | number}}</span><span class="mk-l">SMS envoyés</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#009A44">{{com.kpi().tauxLivraisonSms}}%</span><span class="mk-l">Taux de livraison</span></div>
    <div class="mini-kpi"><span class="mk-v" style="color:#185FA5">1 850</span><span class="mk-l">FCFA coût moyen camp.</span></div>
  </div>
  <div style="padding:.75rem 1rem;display:flex;flex-direction:column;gap:8px">
    @for (s of com.smsHistorique(); track s.id) {
      <div style="background:var(--color-background-secondary);border-radius:7px;padding:10px 12px;border:.5px solid var(--color-border-tertiary)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
          <div style="font-size:12px;font-weight:500">{{s.nom}}</div>
          <span class="chip" [ngClass]="s.statut==='envoye'?'cv':'ci'">{{s.statut}}</span>
        </div>
        <div style="font-size:11px;color:var(--color-text-secondary)">
          <span class="chip cp" style="font-size:9px;padding:1px 5px">{{s.type}}</span>
          — {{s.destinataires}} — {{s.nbDestinataires | number}} destinataires — {{s.dateEnvoi}}
        </div>
        @if (s.tauxLivraison > 0) {
          <div style="margin-top:6px;display:flex;align-items:center;gap:8px">
            <div style="flex:1;height:6px;background:var(--color-border-tertiary);border-radius:3px;overflow:hidden">
              <div style="height:100%;border-radius:3px;background:#009A44;transition:width .3s" [style.width.%]="s.tauxLivraison"></div>
            </div>
            <span style="font-size:11px;color:#009A44;font-weight:500">{{s.tauxLivraison}}% livrés</span>
          </div>
        }
      </div>
    }
    @empty { <div class="empty-row">Aucun envoi enregistré</div> }
  </div>
}
</div>
  `
})
export class SmsComponent implements OnInit {
  readonly com   = inject(CommunicationService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('alerte');
  saving = signal(false);
  altCount  = 0;
  campCount = 0;
  fAlt  = { message:'', cible:'', quartier:'', priorite:'normale' };
  fCamp = { nom:'', type:'info', message:'', dest:'', quand:'maintenant', dateHeure:'' };

  tabs = [
    { id: 'alerte' as Tab,     label: 'Alertes',             icon: 'ti-bell' },
    { id: 'campagne' as Tab,   label: "Campagne d'information", icon: 'ti-send' },
    { id: 'historique' as Tab, label: 'Historique',          icon: 'ti-history' },
  ];

  ngOnInit(): void { this.com.loadSmsHistorique(); }

  nbDest(d: string): number { return NB_DEST[d] ?? 0; }
  coutEstime(d: string): number { return Math.round(this.nbDest(d) * 0.15); }
  totalSms(): number { return this.com.smsHistorique().filter(s => s.statut === 'envoye').reduce((acc, s) => acc + s.nbDestinataires, 0); }

  envoyerAlerte(): void {
    if (!this.fAlt.message || !this.fAlt.cible) { this.toast.show('alt', 'Message et groupe cible obligatoires'); return; }
    this.saving.set(true);
    this.com.envoyerAlerte({ message: this.fAlt.message, cible: this.fAlt.cible, quartier: this.fAlt.quartier, priorite: this.fAlt.priorite }).subscribe({
      next: c => { this.toast.show('alt', `Alerte envoyée à ${new Intl.NumberFormat('fr-FR').format(c.nbDestinataires)} destinataires`); this.saving.set(false); this.fAlt = { message:'', cible:'', quartier:'', priorite:'normale' }; this.altCount = 0; },
      error: () => this.saving.set(false)
    });
  }

  lancerCampagne(): void {
    if (!this.fCamp.nom || !this.fCamp.message || !this.fCamp.dest) { this.toast.show('camp', 'Nom, message et destinataires obligatoires'); return; }
    this.saving.set(true);
    const programme = this.fCamp.quand === 'programme';
    this.com.lancerCampagne({ nom: this.fCamp.nom, type: this.fCamp.type, message: this.fCamp.message, destinataires: this.fCamp.dest, date_envoi: programme ? this.fCamp.dateHeure : new Date().toISOString().slice(0,10), programme }).subscribe({
      next: c => {
        const msg = programme ? `Campagne programmée — ${c.nom}` : `Campagne envoyée à ${new Intl.NumberFormat('fr-FR').format(c.nbDestinataires)} destinataires`;
        this.toast.show('camp', msg); this.saving.set(false);
        this.fCamp = { nom:'', type:'info', message:'', dest:'', quand:'maintenant', dateHeure:'' }; this.campCount = 0;
      },
      error: () => this.saving.set(false)
    });
  }
}
