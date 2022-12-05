import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityPaymentComponent } from './electricity-payment.component';

describe('ElectricityPaymentComponent', () => {
  let component: ElectricityPaymentComponent;
  let fixture: ComponentFixture<ElectricityPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricityPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
