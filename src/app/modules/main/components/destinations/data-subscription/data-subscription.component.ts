import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { NotificationComponent } from 'src/app/modules/shared/components/notification/notification.component';
import { Feedback, IDataRecharge, IDataVariation, IDatawayPaymentPayload, IDatawayService, IDatawayServiceVariation, INearlyFreePurchasePayload, INearlyFreeServiceNetwork, INearlyFreeServicePlan, INotification, NEARLYFREE_SERVICES, notificationsViewStatus } from 'src/app/modules/shared/interfaces/main.interfaces';
import { DataSubscriptionService } from 'src/app/modules/shared/services/data-subscription/data-subscription.service';
import { DatawayService } from 'src/app/modules/shared/services/dataway/dataway.service';
import { NearlyfreeService } from 'src/app/modules/shared/services/nearlyfree/nearlyfree.service';
import { NotificationsService } from 'src/app/modules/shared/services/notifications/notifications.service';
import { UsersService } from 'src/app/modules/shared/services/users/users.service';
import { User, Admin } from '../../../component/profile/profile.component';
@Component({
  selector: 'app-data-subscription',
  templateUrl: './data-subscription.component.html',
  styleUrls: ['./data-subscription.component.scss']
})
export class DataSubscriptionComponent implements OnInit {
  title = 'Data Subscription'
  recharging = false;
  fetchingVariations = false;
  testNumbers = {
    mtn: '08011111111'
  }

  user = new User();
  admin = new Admin();

  isAdmin = false;

  dataServices : IDatawayService[] = []
  servicePlans : IDatawayServiceVariation[] = []

  rechargeForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    serviceID: new FormControl('mtn-data', [Validators.required]),
    planID: new FormControl('', [Validators.required]),
    amount: new FormControl(0, [Validators.required])
  })
  
  alert = new Alert({
    temporary: true,
    life: 4000
  })

  fetchingServices = false;
  notificationsViewStatus = notificationsViewStatus
  notification : INotification = {body: "", target: "dashboard"}
  notificationVisibility = false;
  constructor(
    public dialogService : DialogService,
    private notificationsService: NotificationsService,
    @Inject('NOTIFICATION_KEY') private notificationkey: string,
    private usersService: UsersService,
    private datawayService: DatawayService,
    private nfService: NearlyfreeService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {

    this.route.queryParams.subscribe(async q => {
      if (q) {
        this.fetchingServices = true;
        this.datawayService.getServices({serviceCatSlug: q.service_category_slug}).then((resp: any) => {
          this.fetchingServices = false;
          if (resp.success) {
            this.dataServices = resp.data!!;
            this.rechargeForm.setValue({
              ...this.rechargeForm.value,
              serviceID: this.dataServices[0].slug
            })
            this.getPlans();
          } else {
            // display error message
            this.alert.showAlert({message: resp.msg, severity: "error"})
          }
        }).catch(e => {
          this.fetchingServices = false;
          // display error message
          this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
        })
      }
    })

    this.notificationsService.getNotifications().then(r => {

      const notificationsViewStatus = sessionStorage.getItem(this.notificationkey);
      if (notificationsViewStatus) {
        const n = JSON.parse(notificationsViewStatus);
        if (!n.data) {

          let actualNotification = r.data.filter((n : any) => n.target == "data")
          if (actualNotification.length > 0) {
            n.data = true;
            sessionStorage.setItem(this.notificationkey, JSON.stringify(n));
            this.notification = actualNotification[0];
            this.notificationVisibility = true; 
          }
        }
      } else {
        
        let actualNotification = r.data.filter((n : any) => n.target == "data")
        if (actualNotification.length > 0) {
          this.notificationsViewStatus.data = true;
          sessionStorage.setItem(this.notificationkey, JSON.stringify(this.notificationsViewStatus));
          this.notification = actualNotification[0];
          this.notificationVisibility = true;
        }
      }
    })
  }

  
  async getPlans() {
    this.fetchingServices = true;
    this.datawayService.getServiceVariations({serviceSlug: this.rechargeForm.value.serviceID}).then(r => {
      this.fetchingServices = false;
      if (r.success) {
        if (typeof r.data == 'string') {
          this.alert.showAlert({message: r.data, severity: "error"})
        } else {
          this.servicePlans = r.data as IDatawayServiceVariation[];
          this.rechargeForm.get('planID')?.setValue(this.servicePlans[0].slug)
          this.updateValidators();
        }
      } else {
        // display error message
        this.alert.showAlert({message: r.msg as string, severity: "error"})
      }
    }).catch(e => {
      this.fetchingServices = false;
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

 
  updateValidators() {
    const plan = this.servicePlans.filter(plan => plan.slug == this.rechargeForm.value['planID'])[0];
     // Only useful with nearlyfree
    // const validators = [
    //   Validators.min(isNaN(Number(plan.minimum)) ? 0 : Number(plan.minimum)),
    //   Validators.max(isNaN(Number(plan.maximum)) ? 99999999 : Number(plan.maximum))
    // ]  

    // this.rechargeForm.get('planID')?.addValidators(validators)
    // this.rechargeForm.get('amount')?.addValidators(validators)
    this.rechargeForm.get('amount')?.setValue(Number(plan.amount))

  }

  async rechargeData() {
    this.recharging = true;

    const purchasePayload : IDatawayPaymentPayload = {
      serviceSlug: this.rechargeForm.get('serviceID')?.value,
      variationSlug: this.rechargeForm.get('planID')?.value,
      amount: this.rechargeForm.get('amount')?.value,
      billerIdentifier: this.rechargeForm.get('phone')?.value,
      reference: ''
    }
    
    this.datawayService.vend(purchasePayload).then(resp => {
      if (resp.success) {
        this.alert.showAlert({message: resp.msg!!, severity: "success"})
        this.recharging = false;     
      } else {
          this.alert.showAlert({message: resp?.data?.response_description?.replace('biller identifier', 'phone number') || resp.msg!!, severity: "error"})
          this.recharging = false;
      }
    }).catch(e => {
      this.recharging = false;
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

}
