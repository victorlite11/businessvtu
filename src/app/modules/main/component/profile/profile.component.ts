import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { NotificationComponent } from 'src/app/modules/shared/components/notification/notification.component';
import { IUser, _UserInfo, _UserLoginCredential, _UserWallet, _UserTransaction, IAdmin, AdminSupremacy, Transaction, IDatawayServiceCategory, ICEE, notificationsViewStatus, INotification } from 'src/app/modules/shared/interfaces/main.interfaces';
import { DatawayService } from 'src/app/modules/shared/services/dataway/dataway.service';
import { NotificationsService } from 'src/app/modules/shared/services/notifications/notifications.service';
import { UsersService } from 'src/app/modules/shared/services/users/users.service';

export interface CEEAdminMenu {
  title: string;
  icon: string;
  dest: string;
}

export class User implements IUser {
  info: _UserInfo = {
    fullname: '',
    email: '',
    phone: ''
  }
  credential: _UserLoginCredential = {
    password: ''
  }
  wallet: _UserWallet = {balance: 0};
  transactions: _UserTransaction[] = [];
}

export class Admin extends User implements IAdmin {
  supremacy = AdminSupremacy.OVERALL;
}

export interface ICEEServicesMenu extends IDatawayServiceCategory {
  icon: string;
  dest: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  CEEservices : ICEEServicesMenu[] = [
    {name: "Airtime", icon: "mobile", slug: "airtime", status: "active", dest: "airtime-recharge"},
    {name: "Data", icon: "wifi", slug: "data", status: "active", dest: "data-subscription"},
    {name: "TV", icon: "desktop", slug: "TV", status: "active", dest: "tv-subscription"},
    {name: "Power", icon: "link", slug: "power", status: "active", dest: "electricity-payment"},
    {name: "Education", icon: "book", slug: "education", status: "inactive", dest: "education"},
    {name: "Internet Services", icon: "globe", slug: "internet-services", status: "inactive", dest: "internet-services"},
  ]

  dwServiceCategories : IDatawayServiceCategory[] = [];

  CEEAdminMenus : CEEAdminMenu[] = [
    {title: "Customers", icon: "users", dest: "users"},
    {title: "Payments", icon: "dollar", dest: "payments"},
    {title: "Transactions", icon: "bars", dest: "transactions"},
  ]

  transactions : Transaction[] = [];

  user = new User();
  admin = new Admin();

  notificationsViewStatus = notificationsViewStatus;
  notification : INotification = {body: "", target: "dashboard"}
  notificationVisibility = false;

  datawayngBalance = "";

  isAdmin = false;

  alert = new Alert({
    temporary: true,
    life: 4000
  })

  constructor(
    private usersService: UsersService,
    public dialogService : DialogService,
    private notificationsService: NotificationsService,
    @Inject('NOTIFICATION_KEY') private notificationkey: string,
    private router: Router,
    private route: ActivatedRoute,
    @Inject('ADMIN_STATUS_KEY') private adminkey: string,
    @Inject('USER_PERSONAL_DETAILS_KEY') private userPersonalDetailsKey: string,
  ) { }

  ngOnInit(): void {
    this.init();


    this.notificationsService.getNotifications().then(r => {

      const notificationsViewStatus = sessionStorage.getItem(this.notificationkey);
      if (notificationsViewStatus) {
        const n = JSON.parse(notificationsViewStatus);
        if (!n.dashboard) {

          let actualNotification = r.data.filter((n : any) => n.target == "dashboard")
          if (actualNotification.length > 0) {
            n.dashboard = true;
            sessionStorage.setItem(this.notificationkey, JSON.stringify(n));
            this.notification = actualNotification[0];
            this.notificationVisibility = true;
          }
        }
      } else {
        
        let actualNotification = r.data.filter((n : any) => n.target == "dashboard")
        if (actualNotification.length > 0) {
          this.notificationsViewStatus.dashboard = true;
          sessionStorage.setItem(this.notificationkey, JSON.stringify(this.notificationsViewStatus));
          this.notification = actualNotification[0];
          this.notificationVisibility = true;
        }
      }
    })
  }

  async init() {
    // get profile
    this.usersService.getProfile().then(async response => {
      // save user personal details in session storage
      sessionStorage.setItem(this.userPersonalDetailsKey, JSON.stringify((<User>response.data).info));
      
      if (response.data.hasOwnProperty('supremacy')) {
        // Retrieved data belongs to an admin
        this.isAdmin = true;
        this.admin = response.data
        sessionStorage.setItem(this.adminkey, 'admin')

      } else {
        this.isAdmin = false;
        this.user = response.data
      }

      this.transactions = (<Transaction[]>response.data.transactions).map((trx : any) => {
        trx.date = new Date(trx.date).toDateString();
        return trx;
      }).slice(0,9)
      this.transactions.reverse();
    })
  }

  navigateToService(destination: string, status : string, op ?: {queryParams: any}) {
    if (status == "active") {
      this.navigate("dashboard/" + destination, op);
    } else {
      this.alert.showAlert({message: "Currently unavailable"!, severity: "error"})
    }
  }

  navigate(destination: string, op ?: {queryParams: any}) {
    this.router.navigate([destination], {
      relativeTo: this.route.parent?.parent,
      queryParams: op?.queryParams || {}
    })
  }

  showAllTrxs() {
    this.router.navigate(['dashboard/transactions'], {
      relativeTo: this.route.parent?.parent,
      queryParams: {
        self: true
      }
    })
  }

}
