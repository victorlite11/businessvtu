import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificationComponent } from 'src/app/modules/shared/components/notification/notification.component';
import { INotification, notificationsViewStatus } from 'src/app/modules/shared/interfaces/main.interfaces';
import { NotificationsService } from 'src/app/modules/shared/services/notifications/notifications.service';

export interface ICEEService {
  title: string;
  icon: string;
  description: string;
}

export interface ICEEStatistic {
  figure: string;
  icon: string;
  title: string;
}

export interface IContact {
  name: string;
  detail: string;
  icon: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  notificationsViewStatus = notificationsViewStatus;
  notification : INotification = {body: "", target: "dashboard"}
  notificationVisibility = false;
  serviceOptions = [
    { name: "Airtime", value: 'airtime-recharge', icon: "mobile" },
    { name: "Data", value: 'data-subscription', icon: "wifi" },
    { name: "Cable Sub", value: 'tv-subscription', icon: "desktop" },
    { name: "WAEC/NECO e-PIN", value: 'education-payment', icon: "book" },
    { name: "Electricity", value: 'electricity-payment', icon: "link" },
  ];
  serviceID : string = this.serviceOptions[0].name;
  CEEservices : ICEEService[] = [
    {title: "Airtime Topup", icon: "mobile", description: "We provide airtime top ups for all major network providers. MTN, GLO, Airtel, 9Mobile etc"},
    {title: "Data Subscription", icon: "wifi", description: "Buy cheap data subscriptions from us, available on all networks"},
    {title: "TV Cable Subscription", icon: "desktop", description: "Ease and simple cable subscription. You can subscribe to goTV, DSTV, StarTimes, etc on our platform"},
    {title: "Electricity Bill Payment", icon: "link", description: "You can pay for electric bill for all electricity distribution companies in Nigeria. fast and easy."},
    {title: "WAEC/NECO e-PIN", icon: "book", description: "You can buy your WAEC/NECO e-PIN on our platform."},
    {title: "Airtime to Cash", icon: "dollar", description: "You can turn your airtime to cash easily."},
    {title: "More", icon: "th-large", description: "Many more services coming soon. We are dedicated to providing decent telecom services that will make your life easier."},
  ]

  CEEstatistics :  ICEEStatistic[] = [
    {figure: "100+", title: "Customers", icon: "users"},
    {figure: "10+", title: "Services", icon: "tags"},
    {figure: "100%", title: "Availability", icon: "star"},
  ]

  isAuthenticated : boolean = false;
  isAdmin = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject('AUTH_KEY_PROPERTY_NAME') private authkey: string,
    @Inject('ADMIN_STATUS_KEY') private adminkey: string,
    public dialogService : DialogService,
    private notificationsService: NotificationsService,
    @Inject('NOTIFICATION_KEY') private notificationkey: string,
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = sessionStorage.getItem(this.authkey) ? true : false;
    if (this.isAuthenticated) {
      this.isAdmin = sessionStorage.getItem(this.adminkey) ? true : false;
    }

    this.notificationsService.getNotifications().then(r => {

      const notificationsViewStatus = sessionStorage.getItem(this.notificationkey);
      if (notificationsViewStatus) {
        const n = JSON.parse(notificationsViewStatus);
        if (!n.home) {

          let actualNotification = r.data.filter((n : any) => n.target == "home")
          this.notification = actualNotification[0];
          this.notificationVisibility = true; 
        }
      } else {
        
        let actualNotification = r.data.filter((n : any) => n.target == "home")
        if (actualNotification.length > 0) {
          this.notificationsViewStatus.home = true;
          sessionStorage.setItem(this.notificationkey, JSON.stringify(this.notificationsViewStatus));
          this.notification = actualNotification[0];
          this.notificationVisibility = true;
        }
      }
    })
  }

  navigate(destination: string) {
    this.router.navigate([destination], {
      relativeTo: this.route
    })
  }

}
