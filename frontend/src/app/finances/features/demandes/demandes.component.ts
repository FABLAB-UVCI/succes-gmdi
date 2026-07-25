import { Component } from '@angular/core';
import { DemandesCitoyensComponent } from '../../../shared/components/demandes-citoyens.component';

@Component({
  selector: 'app-finances-demandes',
  standalone: true,
  imports: [DemandesCitoyensComponent],
  template: `
    <app-demandes-citoyens moduleName="finances" moduleLabel="Finances" />
  `
})
export class DemandesComponent {}
