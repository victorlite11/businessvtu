import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtimeRechargeComponent } from './airtime-recharge.component';

describe('AirtimeRechargeComponent', () => {
  let component: AirtimeRechargeComponent;
  let fixture: ComponentFixture<AirtimeRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirtimeRechargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtimeRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
