import { TestBed } from '@angular/core/testing';

import { Adoption } from './adoption';

describe('Adoption', () => {
  let service: Adoption;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Adoption);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
