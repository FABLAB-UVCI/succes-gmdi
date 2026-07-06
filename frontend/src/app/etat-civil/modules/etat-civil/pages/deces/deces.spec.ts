import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deces } from './deces';

describe('Deces', () => {
  let component: Deces;
  let fixture: ComponentFixture<Deces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deces],
    }).compileComponents();

    fixture = TestBed.createComponent(Deces);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
