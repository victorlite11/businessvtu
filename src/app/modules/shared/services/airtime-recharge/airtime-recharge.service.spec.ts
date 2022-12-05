import { TestBed } from '@angular/core/testing';

import { AirtimeRechargeService } from './airtime-recharge.service';

describe('AirtimeRechargeService', () => {
  let service: AirtimeRechargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirtimeRechargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
