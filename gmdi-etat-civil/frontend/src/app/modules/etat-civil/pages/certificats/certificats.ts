import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

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

  celibatForm = { nom: '', prenom: '', dob: '', acteRef: '' };
  residenceForm = { nom: '', prenom: '', adresse: '', commune: '' };
  vieForm = { nom: '', prenom: '', dob: '' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCertificats().subscribe({ next: d => this.certificats.set(d), error: () => {} });
  }

  switchTab(tab: string) { this.currentTab.set(tab); }

  notify(msg: string) {
    this.toastMsg.set(msg); this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3500);
  }

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
          this.celibatForm = { nom: '', prenom: '', dob: '', acteRef: '' };
          this.residenceForm = { nom: '', prenom: '', adresse: '', commune: '' };
          this.vieForm = { nom: '', prenom: '', dob: '' };
        },
        error: () => this.notify("Erreur lors de la délivrance")
      });
  }
}
