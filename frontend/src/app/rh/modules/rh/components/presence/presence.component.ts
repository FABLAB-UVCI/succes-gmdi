import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RhService } from '../../../../core/services/rh.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast.component';
import { Conge } from '../../../../core/models/rh.models';

type Tab = 'pointage' | 'conges' | 'absences' | 'permissions';

interface JourCal { label: string; classe: string; }

@Component({
  selector: 'app-presence',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  template: `
<div class="nav">
  @for (t of tabs; track t.id) {
    <div class="ni" [class.act]="activeTab() === t.id" (click)="activeTab.set(t.id)">
      <i class="ti {{ t.icon }}"></i>{{ t.label }}
    </div>
  }
</div>

<!-- ── Pointage ───────────────────────────────────────────────────────── -->
@if (activeTab() === 'pointage') {
  <div class="card">
    <div class="ch">
      <h3><i class="ti ti-fingerprint"></i>Pointage du jour — 26 mai 2025</h3>
      <div class="ha"><span style="font-size:12px;color:var(--color-text-secondary)">Présents: <strong>312</strong> / 347</span></div>
    </div>
    <div class="pb">
      <div class="fr3" style="margin-bottom:.75rem">
        <div class="fg"><div class="fl">Matricule ou nom</div><input class="fi" [(ngModel)]="pt.matricule" placeholder="Saisir le matricule..."></div>
        <div class="fg"><div class="fl">Statut</div>
          <select class="fsel" [(ngModel)]="pt.statut">
            <option value="present">Présent</option>
            <option value="absent">Absent</option>
            <option value="retard">En retard</option>
            <option value="conge">En congé</option>
          </select>
        </div>
        <div class="fg" style="justify-content:flex-end;flex-direction:row;padding-top:14px;gap:6px;align-items:center">
          <button class="bp" (click)="pointer()"><i class="ti ti-fingerprint"></i>Pointer</button>
        </div>
      </div>
      <app-toast [visible]="toast.get('pt')?.visible ?? false" [message]="toast.get('pt')?.message ?? ''" />
      <div class="fs">Récapitulatif du mois de mai</div>
      <div class="pres-grid">
        @for (j of calendrier; track $index) {
          <div class="pres-day" [ngClass]="j.classe">{{ j.label }}</div>
        }
      </div>
    </div>
  </div>
}

<!-- ── Congés ──────────────────────────────────────────────────────────── -->
@if (activeTab() === 'conges') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-beach"></i>Gestion des congés</h3></div>
    <app-toast [visible]="toast.get('cg')?.visible ?? false" [message]="toast.get('cg')?.message ?? ''" />
    <div class="pb">
      <div class="fs">Nouvelle demande de congé</div>
      <div class="fr3">
        <div class="fg"><div class="fl">Matricule de l'agent <span class="req">*</span></div><input class="fi" [(ngModel)]="cg.matricule" placeholder="Ex: RH-002"></div>
        <div class="fg"><div class="fl">Type de congé <span class="req">*</span></div>
          <select class="fsel" [(ngModel)]="cg.type">
            <option value="annuel">Congé annuel</option>
            <option value="maladie">Congé maladie</option>
            <option value="maternite">Congé maternité</option>
            <option value="paternite">Congé paternité</option>
            <option value="deces">Congé décès</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Nombre de jours <span class="req">*</span></div><input class="fi" type="number" [(ngModel)]="cg.duree" placeholder="Ex: 14" min="1"></div>
      </div>
      
      <div class="fr">
        <div class="fg"><div class="fl">Date de début <span class="req">*</span></div><input class="fi" type="date" [(ngModel)]="cg.dateDebut"></div>
        <div class="fg"><div class="fl">Date de fin</div><input class="fi" type="date" [value]="dateFin()" readonly style="color:var(--color-text-secondary)"></div>
      </div>
      
      <div class="fr">
        <div class="fg" style="grid-column:span 2">
          <div class="fl">Motif</div>
          <input class="fi" [(ngModel)]="cg.motif" placeholder="Préciser le motif si nécessaire">
        </div>
      </div>

      <!-- Ajout du champ d'upload de document -->
      <div class="fr">
        <div class="fg" style="grid-column:span 2">
          <div class="fl">Document justificatif (certificat médical, etc.)</div>
          <input class="fi" type="file" accept=".pdf,.jpg,.jpeg,.png" (change)="onCongeFileSelected($event)">
          @if (cg.pieceJointe) {
            <small style="color: #009A44; display: block; margin-top: 5px;">
              ✓ Document chargé: {{ cg.pieceJointe.name }}
            </small>
          }
          <small style="color: #6c757d; display: block; margin-top: 4px;">
            Formats acceptés: PDF, JPG, PNG (max 5MB)
          </small>
        </div>
      </div>
      
      <div class="fa">
        <button class="bp" (click)="soumettreConge()"><i class="ti ti-check"></i>Soumettre la demande</button>
      </div>
      
      <div class="fs" style="margin-top:.75rem">Demandes en attente</div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Type</th>
            <th>Début</th>
            <th>Durée</th>
            <th>Document</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (c of rh.conges(); track c.id) {
            <tr>
              <td class="bold">{{ c.agent }}</td>
              <td>{{ c.type }}</td>
              <td>{{ c.dateDebut }}</td>
              <td>{{ c.duree }} j</td>
              <td>
                @if (c.pieceJointe) {
                  <span class="chip cv" style="cursor: pointer;" title="Document joint">📎 {{ c.pieceJointe }}</span>
                } @else {
                  <span class="chip">—</span>
                }
              </td>
              <td><span class="chip" [ngClass]="chipConge(c.statut)">{{ c.statut }}</span></td>
              <td>
                <button class="bti ok" title="Approuver" (click)="rh.approuverConge(c.id).subscribe()"><i class="ti ti-check"></i></button>
                <button class="bti warn" title="Refuser" (click)="rh.refuserConge(c.id).subscribe()"><i class="ti ti-x"></i></button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Absences ────────────────────────────────────────────────────────── -->
@if (activeTab() === 'absences') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-user-off"></i>Gestion des absences</h3></div>
    <app-toast [visible]="toast.get('ab')?.visible ?? false" [message]="toast.get('ab')?.message ?? ''" />
    <div class="pb">
      <div class="fs">Déclarer une absence</div>
      <div class="fr3">
        <div class="fg"><div class="fl">Matricule <span class="req">*</span></div><input class="fi" [(ngModel)]="ab.matricule" placeholder="Matricule de l'agent"></div>
        <div class="fg"><div class="fl">Date d'absence <span class="req">*</span></div><input class="fi" type="date" [(ngModel)]="ab.date"></div>
        <div class="fg"><div class="fl">Motif</div>
          <select class="fsel" [(ngModel)]="ab.motif">
            <option value="Absence injustifiée">Injustifiée</option>
            <option value="Maladie">Maladie</option>
            <option value="Motif familial">Motif familial</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>
      <div class="fr"><div class="fg" style="grid-column:span 2"><div class="fl">Pièce justificative</div><input class="fi" [(ngModel)]="ab.pj" placeholder="Référence certificat médical ou autre document"></div></div>
      <div class="fa"><button class="bp" (click)="declarer()"><i class="ti ti-check"></i>Déclarer l'absence</button></div>
      <div class="fs" style="margin-top:.75rem">Absences du mois</div>
      <table class="tbl">
        <thead><tr><th>Matricule</th><th>Agent</th><th>Date</th><th>Motif</th><th>Justifié</th></tr></thead>
        <tbody>
          @for (a of rh.absences(); track a.matricule + a.date) {
            <tr>
              <td class="mono">{{ a.matricule }}</td>
              <td class="bold">{{ a.agent }}</td>
              <td>{{ a.date }}</td>
              <td>{{ a.motif }}</td>
              <td><span class="chip" [ngClass]="a.justifie ? 'cv' : 'cr'">{{ a.justifie ? 'Oui' : 'Non' }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Permissions ─────────────────────────────────────────────────────── -->
@if (activeTab() === 'permissions') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-calendar-event"></i>Permissions exceptionnelles</h3></div>
    <app-toast [visible]="toast.get('pm')?.visible ?? false" [message]="toast.get('pm')?.message ?? ''" />
    <div class="pb">
      <div class="fr">
        <div class="fg"><div class="fl">Matricule <span class="req">*</span></div><input class="fi" [(ngModel)]="pm.matricule" placeholder="Matricule de l'agent"></div>
        <div class="fg"><div class="fl">Motif de la permission <span class="req">*</span></div>
          <select class="fsel" [(ngModel)]="pm.motif">
            <option>Mariage</option><option>Naissance enfant</option>
            <option>Décès parent proche</option><option>Déménagement</option>
            <option>Rendez-vous médical</option><option>Autre</option>
          </select>
        </div>
      </div>
      <div class="fr3">
        <div class="fg"><div class="fl">Date <span class="req">*</span></div><input class="fi" type="date" [(ngModel)]="pm.date"></div>
        <div class="fg"><div class="fl">Durée (heures)</div><input class="fi" type="number" [(ngModel)]="pm.duree" placeholder="Ex: 4" min="1" max="8"></div>
        <div class="fg" style="justify-content:flex-end;flex-direction:row;padding-top:14px;gap:6px;align-items:center">
          <button class="bp" (click)="accorderPermission()"><i class="ti ti-check"></i>Accorder</button>
        </div>
      </div>
    </div>
  </div>
}
  `,
})
export class PresenceComponent implements OnInit {
  constructor(readonly rh: RhService, readonly toast: ToastService) {}

  activeTab = signal<Tab>('pointage');

  tabs = [
    { id: 'pointage'    as Tab, label: 'Pointage du jour', icon: 'ti-fingerprint' },
    { id: 'conges'      as Tab, label: 'Congés',           icon: 'ti-beach' },
    { id: 'absences'    as Tab, label: 'Absences',         icon: 'ti-user-off' },
    { id: 'permissions' as Tab, label: 'Permissions',      icon: 'ti-calendar-event' },
  ];

  calendrier: JourCal[] = [];
  pt = { matricule: '', statut: 'present' };
  cg = { matricule: '', type: 'annuel', duree: null as number|null, dateDebut: '', motif: '', pieceJointe: null as File | null };
  ab = { matricule: '', date: '', motif: 'Absence injustifiée', pj: '' };
  pm = { matricule: '', motif: 'Mariage', date: '', duree: null as number|null };

  ngOnInit(): void { this.buildCalendrier(); }

  buildCalendrier(): void {
    const jours = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    const classes = ['pres-ok','pres-ok','pres-cg','pres-ok','pres-abs','pres-we','pres-we',
                     'pres-ok','pres-ok','pres-ok','pres-ok','pres-ok','pres-we','pres-we',
                     'pres-ok','pres-cg','pres-cg','pres-ok','pres-ok','pres-we','pres-we',
                     'pres-ok','pres-ok','pres-ok','pres-abs','pres-abs','pres-we','pres-we',
                     'pres-ok','pres-ok','pres-ok'];
    this.calendrier = jours.map((j,i) => ({ label: j, classe: 'pres-day' }));
    // Full 31 days
    for (let d = 1; d <= 31; d++) {
      this.calendrier.push({ label: String(d), classe: 'pres-day ' + (classes[d-1] ?? 'pres-ok') });
    }
  }

  pointer(): void {
    if (!this.pt.matricule) { this.toast.show('pt', 'Matricule obligatoire'); return; }
    this.toast.show('pt', `Pointage enregistré — ${this.pt.matricule} — ${this.pt.statut}`);
    this.pt.matricule = '';
  }

  dateFin(): string {
    if (!this.cg.dateDebut || !this.cg.duree) return '';
    const d = new Date(this.cg.dateDebut);
    d.setDate(d.getDate() + Number(this.cg.duree) - 1);
    return d.toISOString().slice(0, 10);
  }

  soumettreConge(): void {
    if (!this.cg.matricule || !this.cg.type || !this.cg.duree || !this.cg.dateDebut) {
      this.toast.show('cg', 'Champs obligatoires manquants'); return;
    }
    const agent = this.rh.findAgent(this.cg.matricule);

    // Afficher dans la console le fichier si présent
    if (this.cg.pieceJointe) {
      console.log('Pièce jointe congé:', this.cg.pieceJointe.name);
    }

    this.rh.soumettreConge({
      matricule: this.cg.matricule, agent: agent?.nomComplet ?? this.cg.matricule,
      type: this.cg.type as any, dateDebut: this.cg.dateDebut, duree: Number(this.cg.duree),
      motif: this.cg.motif, statut: 'soumis', pieceJointe: this.cg.pieceJointe?.name
    }).subscribe({
      next: () => {
        this.toast.show('cg', `Demande soumise — ${this.cg.matricule} — ${this.cg.duree}j`);
        this.cg = { matricule: '', type: 'annuel', duree: null, dateDebut: '', motif: '', pieceJointe: null as File | null };
      },
      error: () => this.toast.show('cg', 'Erreur lors de la soumission'),
    });
  }

  onCongeFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cg.pieceJointe = input.files[0];
      
      // Vérification du type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(input.files[0].type)) {
        this.toast.show('cg', 'Format non supporté. Utilisez JPG, PNG ou PDF.');
        this.cg.pieceJointe = null;
        return;
      }
      
      // Vérification de la taille (max 5MB)
      if (input.files[0].size > 5 * 1024 * 1024) {
        this.toast.show('cg', 'Fichier trop volumineux (max 5MB).');
        this.cg.pieceJointe = null;
        return;
      }
      
      this.toast.show('cg', `✓ Document chargé: ${input.files[0].name}`);
    }
  }

  declarer(): void {
    if (!this.ab.matricule || !this.ab.date) { this.toast.show('ab', 'Matricule et date obligatoires'); return; }
    const agent = this.rh.findAgent(this.ab.matricule);
    this.rh.declareAbsence({ matricule: this.ab.matricule, agent: agent?.nomComplet ?? this.ab.matricule, date: this.ab.date, motif: this.ab.motif, justifie: !!this.ab.pj }).subscribe({
      next: () => {
        this.toast.show('ab', `Absence déclarée — ${this.ab.matricule}`);
        this.ab = { matricule: '', date: '', motif: 'Absence injustifiée', pj: '' };
      },
      error: () => this.toast.show('ab', 'Erreur lors de la déclaration'),
    });
  }

  accorderPermission(): void {
    if (!this.pm.matricule || !this.pm.date) { this.toast.show('pm', 'Matricule et date obligatoires'); return; }
    this.toast.show('pm', `Permission accordée — ${this.pm.matricule} — ${this.pm.motif}`);
    this.pm = { matricule: '', motif: 'Mariage', date: '', duree: null };
  }

  chipConge(s: string): string {
    return { soumis: 'cp', approuve: 'cv', refuse: 'cr', en_cours: 'cb' }[s] ?? 'cg';
  }
}
