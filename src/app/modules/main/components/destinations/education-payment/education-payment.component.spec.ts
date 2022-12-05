import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationPaymentComponent } from './education-payment.component';

describe('EducationPaymentComponent', () => {
  let component: EducationPaymentComponent;
  let fixture: ComponentFixture<EducationPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
