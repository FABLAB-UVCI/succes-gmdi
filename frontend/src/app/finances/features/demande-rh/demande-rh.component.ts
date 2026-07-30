import { Component } from '@angular/core';
import { DemandeRhComponent } from '../../../shared/components/demande-rh/demande-rh.component';

@Component({
  selector: 'app-finances-demande-rh',
  standalone: true,
  imports: [DemandeRhComponent],
  template: `
    <app-demande-rh moduleOrigine="finances" />
  `
})
export class FinancesDemandeRhComponent {}
