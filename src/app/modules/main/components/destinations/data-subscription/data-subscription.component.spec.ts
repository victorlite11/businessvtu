import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubscriptionComponent } from './data-subscription.component';

describe('DataSubscriptionComponent', () => {
  let component: DataSubscriptionComponent;
  let fixture: ComponentFixture<DataSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
