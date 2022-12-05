import { TestBed } from '@angular/core/testing';

import { EducationPaymentService } from './education-payment.service';

describe('EducationPaymentService', () => {
  let service: EducationPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducationPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
