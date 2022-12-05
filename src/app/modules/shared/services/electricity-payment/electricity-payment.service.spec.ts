import { TestBed } from '@angular/core/testing';

import { ElectricityPaymentService } from './electricity-payment.service';

describe('ElectricityPaymentService', () => {
  let service: ElectricityPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectricityPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
