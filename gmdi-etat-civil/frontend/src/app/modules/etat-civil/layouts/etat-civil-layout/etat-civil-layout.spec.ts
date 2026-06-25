import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatCivilLayout } from './etat-civil-layout';

describe('EtatCivilLayout', () => {
  let component: EtatCivilLayout;
  let fixture: ComponentFixture<EtatCivilLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtatCivilLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(EtatCivilLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
