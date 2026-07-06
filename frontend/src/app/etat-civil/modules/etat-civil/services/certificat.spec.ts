import { TestBed } from '@angular/core/testing';

import { Certificat } from './certificat';

describe('Certificat', () => {
  let service: Certificat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Certificat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
