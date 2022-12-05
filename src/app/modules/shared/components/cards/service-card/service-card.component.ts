import { Component, OnInit, Input } from '@angular/core';

enum CEEServiceIds {
  AIRTIME = 'airtime-recharge', DATA_SUBSCRIPTION = 'data-subscription',
  TV_SUBSCRIPTION ='tv-subscription', EDUCATION_PAYMENT = 'education-payment',
  ELECTRICITY_PAYMENT = 'electricity-payment'
}

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent implements OnInit {
  @Input() name: string = "";
  @Input() icon: string = "bars";
  @Input() id: CEEServiceIds = CEEServiceIds.AIRTIME
  constructor() { }

  ngOnInit(): void {
  }

}

