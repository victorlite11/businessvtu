import { TestBed } from '@angular/core/testing';

import { NearlyfreeService } from './nearlyfree.service';

describe('NearlyfreeService', () => {
  let service: NearlyfreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NearlyfreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
