import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { TOUTES_COMMUNES } from '../../../../communes.ci';

@Component({
  selector: 'app-certificats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificats.html',
  styleUrls: ['./certificats.css']
})
export class CertificatsComponent implements OnInit {
  currentTab = signal('celibat');
  toastMsg = signal('');
  showToast = signal(false);
  certificats = signal<any[]>([]);

  communesList = TOUTES_COMMUNES;
  celibatForm: { nom: string; prenom: string; dob: string; acteRef: string; cni: File | null } = { nom: '', prenom: '', dob: '', acteRef: '', cni: null };
  residenceForm: { nom: string; prenom: string; adresse: string; commune: string; cni: File | null } = { nom: '', prenom: '', adresse: '', commune: '', cni: null };
  vieForm: { nom: string; prenom: string; dob: string; cni: File | null } = { nom: '', prenom: '', dob: '', cni: null };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCertificats().subscribe({ next: d => this.certificats.set(d), error: () => {} });
  }

  switchTab(tab: string) { this.currentTab.set(tab); }

  notify(msg: string) {
    this.toastMsg.set(msg); this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3500);
  }

  onCniCelibatSelected(e: Event) { this.celibatForm.cni = (e.target as HTMLInputElement).files?.[0] ?? null; }
  onCniResidenceSelected(e: Event) { this.residenceForm.cni = (e.target as HTMLInputElement).files?.[0] ?? null; }
  onCniVieSelected(e: Event) { this.vieForm.cni = (e.target as HTMLInputElement).files?.[0] ?? null; }

  delivrer(type: string) {
    let nom = '', prenom = '', acteRef = '', typeLabel = '';
    if (type === 'Célibat') { nom = this.celibatForm.nom; prenom = this.celibatForm.prenom; acteRef = this.celibatForm.acteRef; typeLabel = 'Célibat'; }
    else if (type === 'Résidence') { nom = this.residenceForm.nom; prenom = this.residenceForm.prenom; typeLabel = 'Résidence'; }
    else if (type === 'Vie') { nom = this.vieForm.nom; prenom = this.vieForm.prenom; typeLabel = 'Vie'; }

    if (!nom) { this.notify('Nom du bénéficiaire requis'); return; }

    this.api.createCertificat({ type: typeLabel, beneficiaire_nom: nom, beneficiaire_prenom: prenom, acte_reference: acteRef })
      .subscribe({
        next: res => {
          this.certificats.update(l => [res, ...l]);
          this.notify(`Certificat de ${typeLabel} délivré — N° ${res.numero}`);
          this.celibatForm = { nom: '', prenom: '', dob: '', acteRef: '', cni: null };
          this.residenceForm = { nom: '', prenom: '', adresse: '', commune: '', cni: null };
          this.vieForm = { nom: '', prenom: '', dob: '', cni: null };
        },
        error: () => this.notify("Erreur lors de la délivrance")
      });
  }
}
