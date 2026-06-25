import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Naissances } from './naissances';

describe('Naissances', () => {
  let component: Naissances;
  let fixture: ComponentFixture<Naissances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Naissances],
    }).compileComponents();

    fixture = TestBed.createComponent(Naissances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
