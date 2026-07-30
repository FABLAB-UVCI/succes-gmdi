import { Component } from '@angular/core';
import { DemandeRhComponent } from '../../../../../shared/components/demande-rh/demande-rh.component';

@Component({
  selector: 'app-etat-civil-demande-rh',
  standalone: true,
  imports: [DemandeRhComponent],
  template: `
    <app-demande-rh moduleOrigine="etat-civil" />
  `
})
export class EtatCivilDemandeRhComponent {}
