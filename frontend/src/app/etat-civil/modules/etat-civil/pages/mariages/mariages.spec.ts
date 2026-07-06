import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mariages } from './mariages';

describe('Mariages', () => {
  let component: Mariages;
  let fixture: ComponentFixture<Mariages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mariages],
    }).compileComponents();

    fixture = TestBed.createComponent(Mariages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
