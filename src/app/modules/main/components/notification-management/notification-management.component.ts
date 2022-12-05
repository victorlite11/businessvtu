import { Component, OnInit } from '@angular/core';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { INotification } from 'src/app/modules/shared/interfaces/main.interfaces';
import { NotificationsService } from 'src/app/modules/shared/services/notifications/notifications.service';

@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styleUrls: ['./notification-management.component.scss']
})
export class NotificationManagementComponent implements OnInit {
  notifications : INotification[] = []
  title = "Manage Notifications"
  fetchingNotifications = false;
  targetNotification : INotification = {
    body: "",
    target: "airtime"
  }
  editing = false;
  creating = false;
  notificationTargets : {name: string, value: string}[] = [
    {name: "Dashboard rage", value: "dashboard"},
    {name: "Airtime recharge page", value: "airtime"},
    {name: "Data subscription page", value: "data"},
    {name: "Fund wallet page", value: "fund-wallet"},
    {name: "TV cable subscription page", value: "tv"},
    {name: "Electricity bill payment page", value: "power"},
    {name: "Home page", value: "home"}
  ]

  alert = new Alert({
    temporary: true,
    life: 4000
  })
  constructor(
    private notificationsService : NotificationsService
  ) { }

  ngOnInit(): void {
    this.fetchNotifications()
  }

  async createNotification() {
    this.creating = true;
    this.editing = false;
    this.targetNotification = {
      body: "",
      target: "dashboard"
    }
  }

  async editNotification(id: string) {
    this.editing = true;
    this.creating = false;
    this.targetNotification = {
      body: this.notifications.filter((n: INotification) => n._id == id)[0].body,
      target: this.notifications.filter((n: INotification) => n._id == id)[0].target
    }
  }

  async deleteNotification(id : string) {
    this.fetchingNotifications = true;
    this.notificationsService.deleteNotification({id: id}).then(r => {
      this.fetchingNotifications = false;
      this.fetchNotifications()
      this.alert.showAlert({message: r.success ? "Notification deleted successfully" : "Unable to delete notification", severity: r.success ? "success" : "error"});
    })
  }

  async fetchNotifications() {
    this.notificationsService.getNotifications().then(r => {
      this.notifications = r.data
    })
  }

  process() {
    this.fetchingNotifications = true;
    if (this.editing) {
      console.log("called")
      this.notificationsService.updateNotification(this.targetNotification).then(r => {
        this.fetchingNotifications = false;
        this.editing = false;
        this.fetchNotifications()
        this.alert.showAlert({message: r.success ? "Notification updated successfully" : "Unable to update notification", severity: r.success ? "success" : "error"});
      }).catch(e => {
        this.fetchingNotifications = false;
        // display error message
        this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
      })
    }

    if (this.creating) {
      console.log("cad")
      this.notificationsService.createNotification(this.targetNotification).then(r => {
        this.fetchingNotifications = false;
        this.creating = false;
        this.fetchNotifications()
        this.alert.showAlert({message: r.success ? "Notification updated successfully" : "Unable to update notification", severity: r.success ? "success" : "error"});
      }).catch(e => {
        this.fetchingNotifications = false;
        // display error message
        this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
      })
    }
  }

}
