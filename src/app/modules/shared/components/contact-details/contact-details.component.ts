import { Component, OnInit } from '@angular/core';
import { IContact } from 'src/app/modules/main/components/home/home.component';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {
  contacts : IContact[] = [
    {name: "PHONE", detail: "08051166361", icon: "phone"},
    {name: "EMAIL", detail: "classyempir@gmail.com", icon: "envelope"},
    {name: "FACEBOOK", detail: "Classy Empire Entaprise", icon: "facebook"},
    {name: "TWITTER", detail: "@CEEnterprise", icon: "twitter"}
  ]
  
  constructor() { }

  ngOnInit(): void {
  }

}
