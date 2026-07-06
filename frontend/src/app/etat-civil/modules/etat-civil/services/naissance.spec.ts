import { TestBed } from '@angular/core/testing';

import { Naissance } from './naissance';

describe('Naissance', () => {
  let service: Naissance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Naissance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
