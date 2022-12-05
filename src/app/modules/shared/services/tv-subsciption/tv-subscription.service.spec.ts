import { TestBed } from '@angular/core/testing';

import { TvSubscriptionService } from './tv-subscription.service';

describe('TvSubscriptionService', () => {
  let service: TvSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TvSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
