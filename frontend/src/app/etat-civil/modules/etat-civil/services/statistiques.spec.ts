import { TestBed } from '@angular/core/testing';

import { Statistiques } from './statistiques';

describe('Statistiques', () => {
  let service: Statistiques;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Statistiques);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
