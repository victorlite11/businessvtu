import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerNavs = [
    {name: "Faqs", url: ""},
    {name: "About us", url: ""},
    {name: "Contact", url: ""},
    {name: "Privacy policy", url: ""}
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
