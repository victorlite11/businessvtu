import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  options = [
    {name: "Airtime Recharge", destination: 'airtime-recharge'},
    {name: "Data Subscription", destination: 'data-subscription'},
    {name: "TV Subscription", destination: 'tv-subscription'},
    {name: "Electricity Payment", destination: 'electricity-payment'},
    {name: "Education Payment", destination: 'education-payment'}
  ]
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  navigate(destination ?: string) {
    if (!destination) {
      return;
    }

    this.router.navigate([destination], {
      relativeTo: this.route
    })
  }

}
