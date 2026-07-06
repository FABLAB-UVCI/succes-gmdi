import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationService } from '../../../../core/services/communication.service';
import { ToastService } from '../../../../core/services/toast.service';

type Tab = 'tableau' | 'publier' | 'calendrier';

const PLATEFORMES = [
  { id: 'facebook',  label: 'Facebook',  color: '#1877F2', icon: 'ti-brand-facebook' },
  { id: 'twitter',   label: 'X (Twitter)', color: '#14171A', icon: 'ti-brand-x' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: 'ti-brand-instagram' },
  { id: 'whatsapp',  label: 'WhatsApp',  color: '#25D366', icon: 'ti-brand-whatsapp' },
];

@Component({
  selector: 'app-reseaux',
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

<!-- ── Tableau de bord ────────────────────────────────────────────────── -->
@if (active()==='tableau') {
  <div class="ph">
    <div class="pt"><i class="ti ti-chart-bar"></i>Tableau de bord réseaux sociaux</div>
    <span style="font-size:11px;color:var(--color-text-secondary)">Mis à jour le {{today}}</span>
  </div>
  <div style="padding:.75rem 1rem;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;border-bottom:.5px solid var(--color-border-tertiary)">
    @for (p of plateformes; track p.id) {
      <div class="mini-kpi">
        <i class="ti {{p.icon}}" [style.color]="p.color" style="font-size:18px;margin-bottom:4px"></i>
        <span class="mk-v" [style.color]="p.color">{{comptePar(p.id)}}</span>
        <span class="mk-l">Abonnés {{p.label}}</span>
      </div>
    }
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:1rem">
    @for (c of com.comptes(); track c.id) {
      <div style="border:.5px solid var(--color-border-tertiary);border-radius:8px;padding:.85rem">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:.5rem">
          <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px" [style.background]="colorPf(c.plateforme)+'15'" [style.color]="colorPf(c.plateforme)">
            <i class="ti {{iconPf(c.plateforme)}}"></i>
          </div>
          <div>
            <div style="font-size:13px;font-weight:500">{{c.nom}}</div>
            <div style="font-size:11px;color:var(--color-text-secondary)">{{c.handle}}</div>
          </div>
        </div>
        <div style="display:flex;gap:12px;margin:.5rem 0">
          <div style="text-align:center"><div style="font-size:14px;font-weight:500" [style.color]="colorPf(c.plateforme)">{{c.abonnes | number}}</div><div style="font-size:10px;color:var(--color-text-secondary)">Abonnés</div></div>
          <div style="text-align:center"><div style="font-size:14px;font-weight:500">{{c.publications}}</div><div style="font-size:10px;color:var(--color-text-secondary)">Publications</div></div>
          <div style="text-align:center"><div style="font-size:14px;font-weight:500;color:#009A44">{{c.tauxEngagement}}%</div><div style="font-size:10px;color:var(--color-text-secondary)">Engagement</div></div>
          <div style="text-align:center"><div style="font-size:14px;font-weight:500">{{c.porteMois | number}}</div><div style="font-size:10px;color:var(--color-text-secondary)">Portée/mois</div></div>
        </div>
        @if (c.dernierPost) {
          <div style="font-size:11px;color:var(--color-text-secondary)">Dernière publication : {{c.dernierPost}}</div>
        }
      </div>
    }
  </div>
}

<!-- ── Publier ────────────────────────────────────────────────────────── -->
@if (active()==='publier') {
  <div class="ph"><div class="pt"><i class="ti ti-send"></i>Publier sur les réseaux sociaux</div></div>
  @if (toast.get('rs')?.visible) { <div class="success-toast show" style="margin:.5rem 1rem"><i class="ti ti-check"></i>{{toast.get('rs')?.message}}</div> }
  <div class="pb">
    <div class="fg" style="margin-bottom:8px">
      <div class="fl">Message / Publication <span style="color:#e63946">*</span></div>
      <textarea class="fi" style="height:90px;padding-top:8px;resize:vertical" [(ngModel)]="fPost.message" placeholder="Rédigez votre message (280 car. pour X, plus pour Facebook/Instagram)..."></textarea>
    </div>
    <div class="fsec">Plateformes cibles</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px">
      @for (p of plateformes; track p.id) {
        <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer;background:var(--color-background-secondary);padding:8px;border-radius:7px;border:.5px solid var(--color-border-tertiary)">
          <input type="checkbox" [checked]="fPost.plateformes.includes(p.id)" (change)="togglePf(p.id)" style="width:auto;height:auto">
          <i class="ti {{p.icon}}" [style.color]="p.color"></i>{{p.label}}
        </label>
      }
    </div>
    <div class="form-grid">
      <div class="fg"><div class="fl">Publication</div>
        <select class="fs" [(ngModel)]="fPost.quand">
          <option value="maintenant">Maintenant</option><option value="programme">Programmer</option>
        </select>
      </div>
      @if (fPost.quand==='programme') {
        <div class="fg"><div class="fl">Date / Heure</div><input class="fi" type="datetime-local" [(ngModel)]="fPost.date"></div>
      }
    </div>
    <div class="fa">
      <button class="btn-s" (click)="fPost.message='';fPost.plateformes=[]"><i class="ti ti-x"></i>Effacer</button>
      <button class="btn-p" [disabled]="saving()" (click)="publierPost()"><i class="ti ti-send"></i>Publier</button>
    </div>
  </div>
}

<!-- ── Calendrier éditorial ───────────────────────────────────────────── -->
@if (active()==='calendrier') {
  <div class="ph">
    <div class="pt"><i class="ti ti-calendar"></i>Calendrier éditorial — {{moisCourant()}}</div>
    <button class="btn-p" (click)="toast.show('cal','Nouveau post ajouté au calendrier')"><i class="ti ti-plus"></i>Ajouter un post</button>
  </div>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>Date</th><th>Contenu prévu</th><th>Plateforme(s)</th><th>Responsable</th><th>Statut</th></tr></thead>
      <tbody>
        @for (p of com.calendrier(); track p.id) {
          <tr>
            <td>{{p.date}}</td>
            <td style="font-weight:500">{{p.contenu}}</td>
            <td>
              @for (pf of p.plateformes; track pf) {
                <i class="ti {{iconPf(pf)}}" [style.color]="colorPf(pf)" style="margin-right:4px;font-size:14px"></i>
              }
            </td>
            <td>{{p.responsable}}</td>
            <td><span class="chip" [ngClass]="chipCal(p.statut)">{{p.statut}}</span></td>
          </tr>
        }
        @empty { <tr><td colspan="5" class="empty-row">Aucun post planifié</td></tr> }
      </tbody>
    </table>
  </div>
  @if (toast.get('cal')?.visible) { <div class="success-toast show" style="margin:8px 1rem"><i class="ti ti-check"></i>{{toast.get('cal')?.message}}</div> }
}
</div>
  `
})
export class ReseauxComponent implements OnInit {
  readonly com   = inject(CommunicationService);
  readonly toast = inject(ToastService);
  active = signal<Tab>('tableau');
  saving = signal(false);
  plateformes = PLATEFORMES;
  today = new Date().toLocaleDateString('fr-FR');
  fPost = { message: '', plateformes: [] as string[], quand: 'maintenant', date: '' };

  tabs = [
    { id: 'tableau' as Tab,    label: 'Tableau de bord',    icon: 'ti-chart-bar' },
    { id: 'publier' as Tab,    label: 'Publier',            icon: 'ti-send' },
    { id: 'calendrier' as Tab, label: 'Calendrier éditorial', icon: 'ti-calendar' },
  ];

  ngOnInit(): void { this.com.loadComptes(); this.com.loadCalendrier(); }

  moisCourant(): string { return new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); }
  comptePar(pf: string): string { const c = this.com.comptes().find(x => x.plateforme === pf); return c ? new Intl.NumberFormat('fr-FR').format(c.abonnes) : '0'; }
  iconPf(pf: string): string { return { facebook:'ti-brand-facebook', twitter:'ti-brand-x', instagram:'ti-brand-instagram', whatsapp:'ti-brand-whatsapp' }[pf] ?? 'ti-device-mobile'; }
  colorPf(pf: string): string { return { facebook:'#1877F2', twitter:'#14171A', instagram:'#E1306C', whatsapp:'#25D366' }[pf] ?? '#888'; }

  togglePf(pf: string): void {
    const idx = this.fPost.plateformes.indexOf(pf);
    if (idx >= 0) this.fPost.plateformes.splice(idx, 1);
    else this.fPost.plateformes.push(pf);
  }

  publierPost(): void {
    if (!this.fPost.message) { this.toast.show('rs', 'Message obligatoire'); return; }
    if (!this.fPost.plateformes.length) { this.toast.show('rs', 'Sélectionnez au moins une plateforme'); return; }
    this.saving.set(true);
    this.com.publierPost({ contenu: this.fPost.message, plateformes: this.fPost.plateformes, programme: this.fPost.quand === 'programme', date: this.fPost.date }).subscribe({
      next: () => { this.toast.show('rs', 'Publié sur : ' + this.fPost.plateformes.join(', ')); this.saving.set(false); this.fPost = { message:'', plateformes:[], quand:'maintenant', date:'' }; },
      error: () => this.saving.set(false)
    });
  }

  chipCal(s: string): string { return { programme:'ci', publie:'cv', a_rediger:'cp', a_confirmer:'cp' }[s] ?? 'cn'; }
}
