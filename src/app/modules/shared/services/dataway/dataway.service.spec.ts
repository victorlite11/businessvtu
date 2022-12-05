import { TestBed } from '@angular/core/testing';

import { DatawayService } from './dataway.service';

describe('DatawayService', () => {
  let service: DatawayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatawayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
