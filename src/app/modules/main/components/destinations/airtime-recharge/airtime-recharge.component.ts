import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { NotificationComponent } from 'src/app/modules/shared/components/notification/notification.component';
import { IDatawayPaymentPayload, IDatawayService, IDatawayServiceVariation, INearlyFreePurchasePayload, INearlyFreeServiceNetwork, INearlyFreeServicePlan, INotification, NEARLYFREE_SERVICES, notificationsViewStatus } from 'src/app/modules/shared/interfaces/main.interfaces';
import { DatawayService } from 'src/app/modules/shared/services/dataway/dataway.service';
import { NearlyfreeService } from 'src/app/modules/shared/services/nearlyfree/nearlyfree.service';
import { NotificationsService } from 'src/app/modules/shared/services/notifications/notifications.service';

@Component({
  selector: 'app-airtime-recharge',
  templateUrl: './airtime-recharge.component.html',
  styleUrls: ['./airtime-recharge.component.scss']
})
export class AirtimeRechargeComponent implements OnInit {
  title = 'Airtime Topup';
  recharging = false;
  testNumbers = {
    mtn: '08011111111'
  }

  rechargeForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    amount: new FormControl(0, [Validators.required, Validators.min(0)]),
    serviceID: new FormControl('', [Validators.required]),
    // planID: new FormControl('', [Validators.required]) only useful to nearlyfree
  })



  isAdmin = false;

  airtimeServices : IDatawayService[] = []
  servicePlans : IDatawayServiceVariation[] = []

  alert = new Alert({
    temporary: true,
    life: 4000
  })

  fetchingServices: boolean = false;

  notificationsViewStatus = notificationsViewStatus;
  notification : INotification = {body: "", target: "dashboard"}
  notificationVisibility = false;
  constructor(
    private nfService: NearlyfreeService,
    private datawayService : DatawayService,
    private route: ActivatedRoute,
    public dialogService : DialogService,
    private notificationsService: NotificationsService,
    @Inject('NOTIFICATION_KEY') private notificationkey: string,
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
            this.airtimeServices = resp.data!!;
            this.rechargeForm.setValue({
              ...this.rechargeForm.value,
              serviceID: this.airtimeServices[0].slug
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
        if (!n.airtime) {

          let actualNotification = r.data.filter((n : any) => n.target == "airtime")
          if (actualNotification.length > 0) {
            n.airtime = true;
            sessionStorage.setItem(this.notificationkey, JSON.stringify(n));
            this.notification = actualNotification[0];
            this.notificationVisibility = true;
          }
        }
      } else {
        
        let actualNotification = r.data.filter((n : any) => n.target == "airtime")
        if (actualNotification.length > 0) {
          this.notificationsViewStatus.airtime = true;
          sessionStorage.setItem(this.notificationkey, JSON.stringify(this.notificationsViewStatus));
          this.notification = actualNotification[0];
          this.notificationVisibility = true;
        }
      }
    })
  }

  async getPlans() {
    // this.fetchingServices = true; Only relevant to nearlyfree
    // this.nfService.getServicePlans({networkId: this.rechargeForm.value.serviceID}).then(r => {
    //   this.fetchingServices = false;
    //   if (r.success) {
    //     if (typeof r.data == 'string') {
    //       this.alert.showAlert({message: r.data, severity: "error"})
    //     } else {
    //       this.servicePlans = r.data as INearlyFreeServicePlan[];
    //       this.rechargeForm.get('planID')?.setValue(this.servicePlans[0].planId)
          
    //       this.updateValidators();
    //     }
    //   } else {
    //     // display error message
    //     this.alert.showAlert({message: r.msg as string, severity: "error"})
    //   }
    // }).catch(e => {
    //   this.fetchingServices = false;
    //   // display error message
    //   this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    // })
  }

  updateValidators() {
    // only relevant to nearlyfree
    // const plan = this.servicePlans.filter(plan => plan.planId == this.rechargeForm.value['planID'])[0];
    // const validators = [
    //   Validators.min(isNaN(Number(plan.minimum)) ? 0 : Number(plan.minimum)),
    //   Validators.max(isNaN(Number(plan.maximum)) ? 99999999 : Number(plan.maximum))
    // ]  

    // this.rechargeForm.get('planID')?.addValidators(validators)
    // this.rechargeForm.get('amount')?.addValidators(validators)
    // this.rechargeForm.get('amount')?.setValue(isNaN(Number(plan.minimum)) ? isNaN(Number(plan.price)) ? 0 : Number(plan.price) : Number(plan.minimum))

  }

  async rechargeAirtime() {
    this.recharging = true;

    const purchasePayload : IDatawayPaymentPayload = {
      serviceSlug: this.rechargeForm.get('serviceID')?.value,
      variationSlug: this.rechargeForm.get('planID')?.value,
      amount: this.rechargeForm.get('amount')?.value,
      billerIdentifier: this.rechargeForm.get('phone')?.value,
      reference: ''
    }
    
    this.datawayService.vend(purchasePayload).then(resp => {
      console.log(resp)
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
