import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvSubscriptionComponent } from './tv-subscription.component';

describe('TvSubscriptionComponent', () => {
  let component: TvSubscriptionComponent;
  let fixture: ComponentFixture<TvSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TvSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TvSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
