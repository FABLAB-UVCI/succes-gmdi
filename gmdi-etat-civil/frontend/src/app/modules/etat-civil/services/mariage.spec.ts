import { TestBed } from '@angular/core/testing';

import { Mariage } from './mariage';

describe('Mariage', () => {
  let service: Mariage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mariage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
