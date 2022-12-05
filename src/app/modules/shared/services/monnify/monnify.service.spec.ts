import { TestBed } from '@angular/core/testing';

import { MonnifyService } from './monnify.service';

describe('MonnifyService', () => {
  let service: MonnifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonnifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
