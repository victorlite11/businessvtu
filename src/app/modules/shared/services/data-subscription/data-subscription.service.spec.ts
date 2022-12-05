import { TestBed } from '@angular/core/testing';

import { DataSubscriptionService } from './data-subscription.service';

describe('DataSubscriptionService', () => {
  let service: DataSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
