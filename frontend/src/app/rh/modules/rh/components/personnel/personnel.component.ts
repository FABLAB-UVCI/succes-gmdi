import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RhService } from '../../../../core/services/rh.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast.component';
import { FcfaPipe } from '../../../../shared/pipes/fcfa.pipe';
import { Agent, TypeContrat, Categorie } from '../../../../core/models/rh.models';

type Tab = 'fiche' | 'liste' | 'fonct' | 'contrat' | 'stage';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, FcfaPipe],
  template: `
<!-- Nav tabs -->
<div class="nav">
  @for (t of tabs; track t.id) {
    <div class="ni" [class.act]="activeTab() === t.id" (click)="activeTab.set(t.id)">
      <i class="ti {{ t.icon }}"></i>{{ t.label }}
    </div>
  }
</div>

<!-- ── Nouvelle fiche ───────────────────────────────────────────────────── -->
@if (activeTab() === 'fiche') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-user-plus"></i>Nouvelle fiche agent</h3></div>
    <app-toast [visible]="toast.get('p')?.visible ?? false" [message]="toast.get('p')?.message ?? ''" [type]="toast.get('p')?.type ?? 'success'" />
    <div class="pb">
      <div class="fs">Identité</div>
      <div class="fr3">
        <div class="fg"><div class="fl">Matricule <span class="req">*</span></div><input class="fi" [(ngModel)]="form.matricule" placeholder="Ex: EC-024"></div>
        <div class="fg"><div class="fl">Nom <span class="req">*</span></div><input class="fi" [(ngModel)]="form.nom" placeholder="Nom de famille"></div>
        <div class="fg"><div class="fl">Prénoms <span class="req">*</span></div><input class="fi" [(ngModel)]="form.prenom" placeholder="Prénoms"></div>
      </div>
      <div class="fr3">
        <div class="fg"><div class="fl">Date de naissance <span class="req">*</span></div><input class="fi" type="date" [(ngModel)]="form.dateNaissance"></div>
        <div class="fg"><div class="fl">Genre</div>
          <select class="fsel" [(ngModel)]="form.genre">
            <option value="M">Masculin</option><option value="F">Féminin</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Situation familiale</div>
          <select class="fsel" [(ngModel)]="form.situationFamiliale">
            <option>Célibataire</option><option>Marié(e)</option><option>Divorcé(e)</option><option>Veuf/Veuve</option>
          </select>
        </div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Téléphone <span class="req">*</span></div><input class="fi" [(ngModel)]="form.telephone" placeholder="+225 07 ..."></div>
        <div class="fg"><div class="fl">Email professionnel <span class="req">*</span></div><input class="fi" type="email" [(ngModel)]="form.email" placeholder="agent@mairie.ci"></div>
      </div>

      <div class="fs">Poste et contrat</div>
      <div class="fr3">
        <div class="fg"><div class="fl">Type de contrat <span class="req">*</span></div>
          <select class="fsel" [(ngModel)]="form.typeContrat">
            <option value="fonctionnaire">Fonctionnaire</option>
            <option value="contractuel">Contractuel</option>
            <option value="stage">Stagiaire</option>
          </select>
        </div>
        <div class="fg"><div class="fl">Poste <span class="req">*</span></div><input class="fi" [(ngModel)]="form.poste" placeholder="Ex: Agent de saisie"></div>
        <div class="fg"><div class="fl">Direction / Service <span class="req">*</span></div>
          <select class="fsel" [(ngModel)]="form.direction">
            <option value="">-- Choisir --</option>
            @for (d of directions; track d) { <option>{{ d }}</option> }
          </select>
        </div>
      </div>
      <div class="fr3">
        <div class="fg"><div class="fl">Catégorie</div>
          <select class="fsel" [(ngModel)]="form.categorie">
            <option value="A">A — Cadre supérieur</option>
            <option value="B">B — Cadre moyen</option>
            <option value="C">C — Agents d'exécution</option>
          </select>
        </div>

        <div class="fg">
          <div class="fl">Spécialité</div>
          <select class="fsel" [(ngModel)]="form.specialite">
            <option value="">-- Sélectionner une spécialité --</option>
            <optgroup label="Administration">
              <option value="Gestion RH">Gestion RH</option>
              <option value="Gestion Financière">Gestion Financière</option>
              <option value="Administration publique">Administration publique</option>
              <option value="Secrétariat">Secrétariat</option>
            </optgroup>
            <optgroup label="Informatique">
              <option value="Développement">Développement</option>
              <option value="Réseaux et Sécurité">Réseaux et Sécurité</option>
              <option value="Base de données">Base de données</option>
              <option value="Support technique">Support technique</option>
            </optgroup>
            <optgroup label="Technique">
              <option value="Génie Civil">Génie Civil</option>
              <option value="Urbanisme">Urbanisme</option>
              <option value="Architecture">Architecture</option>
              <option value="Maintenance">Maintenance</option>
            </optgroup>
            <optgroup label="Communication">
              <option value="Communication digitale">Communication digitale</option>
              <option value="Relations publiques">Relations publiques</option>
              <option value="Journalisme">Journalisme</option>
              <option value="Marketing">Marketing</option>
            </optgroup>
            <optgroup label="Juridique">
              <option value="Droit administratif">Droit administratif</option>
              <option value="Droit des affaires">Droit des affaires</option>
              <option value="Droit social">Droit social</option>
            </optgroup>
          </select>
        </div>

        <div class="fg"><div class="fl">Grade <span class="req">*</span></div><input class="fi" [(ngModel)]="form.grade" placeholder="Ex: Administrateur Principal"></div>
        <div class="fg"><div class="fl">Date d'embauche <span class="req">*</span></div><input class="fi" type="date" [(ngModel)]="form.dateEmbauche"></div>
      </div>
      <div class="fr">
        <div class="fg"><div class="fl">Salaire brut (FCFA) <span class="req">*</span></div><input class="fi" type="number" [(ngModel)]="form.salaireBrut" placeholder="Ex: 280000"></div>
        <div class="fg"><div class="fl">Diplôme le plus élevé</div>
          <select class="fsel" [(ngModel)]="form.diplome">
            <option>BEPC</option><option>BAC</option><option>BTS / DUT</option>
            <option>Licence</option><option>Master</option><option>Doctorat</option>
          </select>
        </div>
      </div>

      <div class="fs">Pièces justificatives</div>
      <div class="fr3">
        <div class="fg">
          <div class="fl">Numéro CNI <span class="req">*</span></div>
          <input class="fi" [(ngModel)]="form.numeroCNI" placeholder="Ex: CI0123456789">
        </div>
        <div class="fg">
          <div class="fl">Copie CNI / Passeport</div>
          <input class="fi" type="file" accept=".pdf,.jpg,.jpeg,.png" (change)="onCniSelected($event)">
          @if (fileCNI) { <span class="file-ok"><i class="ti ti-circle-check"></i>{{ fileCNI.name }}</span> }
        </div>
        <div class="fg">
          <div class="fl">Diplôme (scan PDF)</div>
          <input class="fi" type="file" accept=".pdf,.jpg,.jpeg,.png" (change)="onDiplomeSelected($event)">
          @if (fileDiplome) { <span class="file-ok"><i class="ti ti-circle-check"></i>{{ fileDiplome.name }}</span> }
        </div>
      </div>

      <div class="fa">
        <button class="bs" (click)="resetFiche()"><i class="ti ti-x"></i>Effacer</button>
        <button class="bp" (click)="creerAgent()"><i class="ti ti-check"></i>Enregistrer la fiche</button>
      </div>
    </div>
  </div>
}

<!-- ── Liste agents ─────────────────────────────────────────────────────── -->
@if (activeTab() === 'liste') {
  <div class="card">
    <div class="ch">
      <h3><i class="ti ti-list"></i>Liste des agents</h3>
      <div class="ha">
        <button class="bs" (click)="rh.exportJSON(rh.agents(), 'agents')"><i class="ti ti-download"></i>Exporter JSON</button>
        <button class="bd"><i class="ti ti-printer"></i>Imprimer</button>
      </div>
    </div>
    <div class="tf">
      <input class="fin" [(ngModel)]="filtre.recherche" placeholder="Rechercher nom, matricule...">
      <select class="fsel2" [(ngModel)]="filtre.direction">
        <option value="">Toutes directions</option>
        @for (d of directions; track d) { <option>{{ d }}</option> }
      </select>
      <select class="fsel2" [(ngModel)]="filtre.contrat">
        <option value="">Tous contrats</option>
        <option value="fonctionnaire">Fonctionnaire</option>
        <option value="contractuel">Contractuel</option>
        <option value="stage">Stagiaire</option>
      </select>
      <select class="fsel2" [(ngModel)]="filtre.statut">
        <option value="">Tous statuts</option>
        <option value="actif">Actif</option>
        <option value="conge">En congé</option>
      </select>
      <span class="rc">{{ agentsFiltres().length }} agent(s)</span>
    </div>
    <div style="overflow-x:auto">
      <table class="tbl">
        <thead><tr>
          <th>Matricule</th><th>Agent</th><th>Poste</th><th>Direction</th>
          <th>Contrat</th><th>Salaire brut</th><th>Statut</th><th>Actions</th>
        </tr></thead>
        <tbody>
          @if (agentsFiltres().length === 0) {
            <tr><td colspan="8" class="empty">Aucun agent trouvé</td></tr>
          }
          @for (a of agentsFiltres(); track a.id) {
            <tr>
              <td class="mono">{{ a.matricule }}</td>
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="av-lg">{{ initiales(a.nomComplet) }}</div>
                  <div><div class="bold">{{ a.nomComplet }}</div><div style="font-size:11px;color:var(--color-text-secondary)">{{ a.email }}</div></div>
                </div>
              </td>
              <td>{{ a.poste }}</td>
              <td>{{ a.direction }}</td>
              <td><span class="chip" [ngClass]="chipContrat(a.typeContrat)">{{ labelContrat(a.typeContrat) }}</span></td>
              <td class="right">{{ a.salaireBrut | fcfa }}</td>
              <td><span class="chip" [ngClass]="a.statut === 'actif' ? 'cv' : 'cp'">{{ a.statut === 'actif' ? 'Actif' : 'En congé' }}</span></td>
              <td>
                <button class="bti" title="Voir fiche" (click)="voirFiche(a)"><i class="ti ti-eye"></i></button>
                @if (a.statut !== 'actif') {
                  <button class="bti ok" title="Remettre actif" (click)="reactiverAgent(a)"><i class="ti ti-check"></i></button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Fonctionnaires ───────────────────────────────────────────────────── -->
@if (activeTab() === 'fonct') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-building"></i>Fonctionnaires — {{ rh.totalFonct() }} agent(s)</h3></div>
    <div class="pb">
      <div class="kpi4">
        <div class="kcard"><div class="kv" style="color:#185FA5">{{ rh.totalFonct() }}</div><div class="kl">Total fonctionnaires</div></div>
        <div class="kcard"><div class="kv" style="color:#009A44">{{ rh.parCategorie().A }}</div><div class="kl">Catégorie A</div><div class="ks">Cadres supérieurs</div></div>
        <div class="kcard"><div class="kv" style="color:#C9A84C">{{ rh.parCategorie().B }}</div><div class="kl">Catégorie B</div><div class="ks">Cadres moyens</div></div>
        <div class="kcard"><div class="kv" style="color:#F77F00">{{ rh.parCategorie().C }}</div><div class="kl">Catégorie C</div><div class="ks">Agents d'exécution</div></div>
      </div>
    </div>
  </div>
}

<!-- ── Contractuels ────────────────────────────────────────────────────── -->
@if (activeTab() === 'contrat') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-file-text"></i>Contractuels — {{ rh.totalContrat() }} agent(s)</h3></div>
    <div class="pb">
      <div class="kpi4">
        <div class="kcard"><div class="kv" style="color:#F77F00">{{ rh.totalContrat() }}</div><div class="kl">Total contractuels</div></div>
        <div class="kcard"><div class="kv" style="color:#009A44">{{ contractuelsActifs().length }}</div><div class="kl">CDD en cours</div></div>
      </div>
      <div class="fs" style="margin-top:.75rem">Liste des contractuels</div>
      <table class="tbl">
        <thead><tr><th>Matricule</th><th>Agent</th><th>Poste</th><th>Direction</th><th>Statut</th></tr></thead>
        <tbody>
          @for (a of contractuelsActifs(); track a.id) {
            <tr>
              <td class="mono">{{ a.matricule }}</td>
              <td class="bold">{{ a.nomComplet }}</td>
              <td>{{ a.poste }}</td>
              <td>{{ a.direction }}</td>
              <td><span class="chip" [ngClass]="a.statut === 'actif' ? 'cv' : 'cp'">{{ a.statut === 'actif' ? 'Actif' : 'En congé' }}</span></td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="empty">Aucun contractuel enregistré</td></tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}

<!-- ── Stagiaires ──────────────────────────────────────────────────────── -->
@if (activeTab() === 'stage') {
  <div class="card">
    <div class="ch"><h3><i class="ti ti-school"></i>Stagiaires — {{ rh.totalStagiaires() }} actif(s)</h3></div>
    <div class="pb">
      <div class="kpi4">
        <div class="kcard"><div class="kv" style="color:#009A44">{{ rh.totalStagiaires() }}</div><div class="kl">Stagiaires actifs</div></div>
      </div>
      <div class="fs" style="margin-top:.75rem">Liste des stagiaires</div>
      <table class="tbl">
        <thead><tr><th>Matricule</th><th>Agent</th><th>Poste</th><th>Direction</th><th>Statut</th></tr></thead>
        <tbody>
          @for (a of stagiaires(); track a.id) {
            <tr>
              <td class="mono">{{ a.matricule }}</td>
              <td class="bold">{{ a.nomComplet }}</td>
              <td>{{ a.poste }}</td>
              <td>{{ a.direction }}</td>
              <td><span class="chip" [ngClass]="a.statut === 'actif' ? 'cv' : 'cp'">{{ a.statut === 'actif' ? 'Actif' : 'En congé' }}</span></td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="empty">Aucun stagiaire enregistré</td></tr>
          }
        </tbody>
      </table>
    </div>
  </div>
}
  `,
})
export class PersonnelComponent {
  constructor(readonly rh: RhService, readonly toast: ToastService) {}

  activeTab = signal<Tab>('fiche');

  fileCNI: File | null = null;
  fileDiplome: File | null = null;

  onCniSelected(e: Event) { this.fileCNI = (e.target as HTMLInputElement).files?.[0] ?? null; }
  onDiplomeSelected(e: Event) { this.fileDiplome = (e.target as HTMLInputElement).files?.[0] ?? null; }

  tabs = [
    { id: 'fiche' as Tab,   label: 'Nouvelle fiche', icon: 'ti-user-plus' },
    { id: 'liste' as Tab,   label: 'Liste agents',   icon: 'ti-list'      },
    { id: 'fonct' as Tab,   label: 'Fonctionnaires', icon: 'ti-building'  },
    { id: 'contrat' as Tab, label: 'Contractuels',   icon: 'ti-file-text' },
    { id: 'stage' as Tab,   label: 'Stagiaires',     icon: 'ti-school'    },
  ];

  directions = [
    'Direction État Civil','Direction Finances','DRH','Direction Urbanisme',
    'Services Techniques','Direction Communication','Direction Patrimoine','Cabinet du Maire','DSI',
  ];

  // Form model
  form = this.emptyForm();

  filtre = { recherche: '', direction: '', contrat: '', statut: '' };

  agentsFiltres = computed(() =>
    this.rh.filtrerAgents(this.filtre.recherche, this.filtre.direction, this.filtre.contrat, this.filtre.statut)
  );

  contractuelsActifs = computed(() => this.rh.agents().filter(a => a.typeContrat === 'contractuel'));
  stagiaires         = computed(() => this.rh.agents().filter(a => a.typeContrat === 'stage'));

  creerAgent(): void {
    const { matricule, nom, prenom, poste, direction, salaireBrut, dateEmbauche, dateNaissance, telephone, email, grade } = this.form;
    if (!matricule || !nom || !prenom || !poste || !direction || !salaireBrut || !dateEmbauche || !dateNaissance || !telephone || !email || !grade) {
      this.toast.showError('p', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    this.rh.ajouterAgent({
      matricule,
      nomComplet: `${nom} ${prenom}`,
      nom,
      prenom,
      poste,
      direction,
      typeContrat: this.form.typeContrat as any,
      categorie: this.form.categorie as any,
      specialite: this.form.specialite,
      grade: this.form.grade,
      dateEmbauche,
      dateNaissance: this.form.dateNaissance,
      genre: this.form.genre as any,
      telephone: this.form.telephone,
      email: this.form.email,
      statut: 'actif',
      salaireBrut: Number(salaireBrut),
      congesRestants: 30,
      situationFamiliale: this.form.situationFamiliale,
      diplome: this.form.diplome,
    }).subscribe({
      next: () => {
        this.toast.show('p', `Fiche agent créée — ${matricule} — ${nom} ${prenom}`);
        this.form = this.emptyForm();
        this.fileCNI = null;
        this.fileDiplome = null;
        this.activeTab.set('liste');
      },
      error: (err) => this.toast.showError('p', this.errMsg(err)),
    });
  }

  private errMsg(err: any): string {
    return err?.error?.errors ? (Object.values(err.error.errors) as string[][]).flat().join(' — ') : (err?.error?.message ?? 'Erreur lors de la création de l\'agent');
  }

  resetFiche(): void { this.form = this.emptyForm(); this.fileCNI = null; this.fileDiplome = null; }

  initiales(nom: string): string {
    return nom.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  voirFiche(a: Agent): void {
    alert(`Fiche agent\n\nMatricule : ${a.matricule}\nNom : ${a.nomComplet}\nPoste : ${a.poste}\nDirection : ${a.direction}\nContrat : ${this.labelContrat(a.typeContrat)}\nCatégorie : ${a.categorie}\nGrade : ${a.grade}\nSalaire brut : ${a.salaireBrut} FCFA\nStatut : ${a.statut}\nEmbauché le : ${a.dateEmbauche}`);
  }

  reactiverAgent(a: Agent): void {
    this.rh.modifierAgent(a.id, { statut: 'actif' }).subscribe({
      next: () => this.toast.show('p', `Agent remis actif — ${a.matricule}`),
      error: () => this.toast.showError('p', 'Erreur lors de la mise à jour du statut'),
    });
  }

  chipContrat(t: string): string {
    return { fonctionnaire: 'cb', contractuel: 'cgo', stage: 'cv' }[t] ?? 'cp';
  }

  labelContrat(t: string): string {
    return { fonctionnaire: 'Fonctionnaire', contractuel: 'Contractuel', stage: 'Stagiaire' }[t] ?? t;
  }

  private emptyForm() {
    return {
      matricule: '', nom: '', prenom: '', dateNaissance: '', genre: 'M',
      situationFamiliale: 'Célibataire', telephone: '', email: '',
      typeContrat: 'fonctionnaire', poste: '', direction: '', categorie: 'A',
      specialite: '',
      grade: '', dateEmbauche: '', salaireBrut: null as number | null, diplome: 'Licence',
      numeroCNI: '',
    };
  }
}
