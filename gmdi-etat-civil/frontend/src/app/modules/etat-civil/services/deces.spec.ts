import { TestBed } from '@angular/core/testing';

import { Deces } from './deces';

describe('Deces', () => {
  let service: Deces;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deces);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
