import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { NotificationComponent } from 'src/app/modules/shared/components/notification/notification.component';
import { Feedback, IDatawayPaymentPayload, IDatawayService, IDatawayServiceVariation, INotification, notificationsViewStatus } from 'src/app/modules/shared/interfaces/main.interfaces';
import { DatawayService } from 'src/app/modules/shared/services/dataway/dataway.service';
import { ElectricityPaymentService } from 'src/app/modules/shared/services/electricity-payment/electricity-payment.service';
import { NotificationsService } from 'src/app/modules/shared/services/notifications/notifications.service';
import { UsersService } from 'src/app/modules/shared/services/users/users.service';
import { User, Admin } from '../../../component/profile/profile.component';

@Component({
  selector: 'app-electricity-payment',
  templateUrl: './electricity-payment.component.html',
  styleUrls: ['./electricity-payment.component.scss']
})
export class ElectricityPaymentComponent implements OnInit {
  title = 'Electricity Payment'
  recharging = false;
  fetchingVariations = false;
  metreLabel = "Metre Number"
  validating = false;
  validated = false;
  validationDetails : any = undefined;
  btnText = "Verify";
  testNumbers = {
    mtn: '08011111111'
  }

  rechargeMainToken = ''; // stores the token generated on successful recharge
  rechargeBonusToken = '';

  testMetreNumbers = {
    postpaid: '1010101010101',
    prepaid: '1111111111111'
  }

  metreType = [
    {name: 'PREPAID', value: 'prepaid'},
    {name: 'POSTPAID', value: 'postpaid'}
  ]

  rechargeForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    serviceID: new FormControl('ikeja-electric', [Validators.required]),
    amount: new FormControl(0, [Validators.required, Validators.min(0)]),
    variation_code: new FormControl('prepaid', [Validators.required]), // metre type
    billersCode: new FormControl('', [Validators.required]) // metre number
  })

  
  alert = new Alert({
    temporary: true,
    life: 4000
  })
  
  alert2 = new Alert({
    temporary: true,
    life: 4000
  })

  isAdmin = false;

  powerServices : IDatawayService[] = [];
  serviceVariations : IDatawayServiceVariation[] = [];
  notificationsViewStatus = notificationsViewStatus
  notification : INotification = {body: "", target: "dashboard"}
  notificationVisibility = false;
  constructor(
    public dialogService : DialogService,
    private notificationsService: NotificationsService,
    @Inject('NOTIFICATION_KEY') private notificationkey: string,
    private usersService: UsersService,
    private datawayService: DatawayService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.route.queryParams.subscribe(async q => {
      if (q) {
        this.fetchingVariations = true;
        this.datawayService.getServices({serviceCatSlug: q.service_category_slug}).then((resp: Feedback<any>) => {
          this.fetchingVariations = false;
          if (resp.success) {
            this.powerServices = resp.data!!;
            this.rechargeForm.setValue({
              ...this.rechargeForm.value,
              serviceID: this.powerServices[1].slug
            });
            this.getServiceVariations(this.powerServices[1].slug);
          } else {
            // display error message
            this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
          }
        }).catch(e => {
          this.fetchingVariations = false;
          // display error message
          this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
        })
      }
    })

    this.notificationsService.getNotifications().then(r => {

      const notificationsViewStatus = sessionStorage.getItem(this.notificationkey);
      if (notificationsViewStatus) {
        const n = JSON.parse(notificationsViewStatus);
        if (!n.power) {

          let actualNotification = r.data.filter((n : any) => n.target == "power")
          if (actualNotification.length > 0) {
            n.power = true;
            sessionStorage.setItem(this.notificationkey, JSON.stringify(n));
            this.notification = actualNotification[0];
            this.notificationVisibility = true; 
          }
        }
      } else {
        
        let actualNotification = r.data.filter((n : any) => n.target == "power")
        if (actualNotification.length > 0) {
          this.notificationsViewStatus.power = true;
          sessionStorage.setItem(this.notificationkey, JSON.stringify(this.notificationsViewStatus));
          this.notification = actualNotification[0];
          this.notificationVisibility = true; 
        }
      }
    })
  }

  async getServiceVariations(serviceID: string): Promise<any> {
    this.fetchingVariations = true;
    this.datawayService.getServiceVariations({serviceSlug: serviceID}).then((response: Feedback<any>) => {
      this.fetchingVariations = false;
      if (response.success) {
        this.serviceVariations = response.data!!;
        this.rechargeForm.setValue({
          phone: this.rechargeForm.value.phone,
          serviceID: this.rechargeForm.value.serviceID,
          variation_code: this.serviceVariations[0].slug,
          amount: this.serviceVariations[0].amount,
          billersCode: this.rechargeForm.value.billersCode
        })
      } else {
        this.alert.showAlert({message: response.msg!!, severity: "error"})
      }
    })
  }

  updateMetreNumber() {
    this.validated = false;
    this.validationDetails = undefined
    this.btnText = "Verify";
  }

  async performAction() {
    if (this.validated) {
      this.recharge()
    } else {
      // validate
      this.validate()
    }
  }

  
  async recharge() {
    this.recharging = true;
    let payload : IDatawayPaymentPayload = {
      amount: this.rechargeForm.value.amount,
      billerIdentifier: this.rechargeForm.value.billersCode,
      variationSlug: this.rechargeForm.value.variation_code,
      serviceSlug: this.rechargeForm.value.serviceID
    }

    this.datawayService.vend(payload).then(r => {
      this.recharging = false;
      if (r.success) {
        this.alert2.showAlert({message: r.msg!!, severity: "success"})
      } else {
        this.alert2.showAlert({message: r?.data?.response_description?.replace('biller identifier', 'metre number') || r.msg!!, severity: "error"})
      }
    }).catch(e => {
      this.recharging = false;
    })
  }

  async validate() {
    this.validating = true;
    this.datawayService.validateBiller({
      serviceSlug: this.rechargeForm.value.serviceID,
      variationSlug: this.rechargeForm.value.variation_code,
      billerIdentifier: this.rechargeForm.value.billersCode
    }).then(r => {
      this.validating = false;

      if (r.success) {
        this.validated = true;
        this.validationDetails = r.data;  
        this.btnText = "Recharge";
        this.alert.showAlert({message: r.msg!!.replace("Biller validated", "Metre number verified"), severity: "success"})
      } else {
        this.validated = false;
        this.validationDetails = undefined;
        this.btnText = "Verify";
        this.alert.showAlert({message: r?.data?.response_description?.replace('biller identifier', 'metre number') || r.msg!!, severity: "error"})
      
      }
    }).catch(e => {
      this.validating = false;
    })
  }

}
