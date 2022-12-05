import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { IContact } from './modules/main/components/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'naijasave-bill-payments';

  contacts : IContact[] = [
    {name: "PHONE", detail: "+2348051166361", icon: "phone"},
    {name: "EMAIL", detail: "classyempir@gmail.com", icon: "envelope"},
    {name: "FACEBOOK", detail: "Classy Empire Entaprise", icon: "facebook"},
    {name: "TWITTER", detail: "@CEEnterprise", icon: "twitter"}
  ]

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {}
  items: MenuItem[] = [
    {
      icon: 'pi pi-phone',
      command: () => {
        this.document.location.href = `tel:${this.contacts[0].detail}`
      }
  },
  {
    icon: 'pi pi-comment',
    command: () => {
       this.document.location.href = `https://wa.me/${this.contacts[0].detail}`
    }
  },
  {
    icon: 'pi pi-facebook',
    command: () => {
      this.document.location.href = `https://www.facebook.com/Classy-Empire-Enterprise-105713968683599/`
    }
  },
  {
    icon: 'pi pi-twitter',
    command: () => {
      this.document.location.href = `https://twitter.com/CEEnterprise`  
    }
  },
    {
    icon: 'pi pi-envelope',
    command: () => {
      this.document.location.href = "mailto:classyempir@gmail.com?subject=I%20need%20help"
    }
  }
  ];
}
