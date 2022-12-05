import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { Feedback, IDatawayPaymentPayload, IDatawayService, IDatawayServiceVariation, ITVSubscription, ITVSubscriptionVariation } from 'src/app/modules/shared/interfaces/main.interfaces';
import { DatawayService } from 'src/app/modules/shared/services/dataway/dataway.service';
import { TvSubscriptionService } from 'src/app/modules/shared/services/tv-subsciption/tv-subscription.service';
import { UsersService } from 'src/app/modules/shared/services/users/users.service';
import { User, Admin } from '../../../component/profile/profile.component';

@Component({
  selector: 'app-tv-subscription',
  templateUrl: './tv-subscription.component.html',
  styleUrls: ['./tv-subscription.component.scss']
})
export class TvSubscriptionComponent implements OnInit {
  title = 'TV Subscription'
  recharging = false;
  fetchingVariations = false;
  validated = false;
  validating = false;
  validationDetails : any = undefined;

  btnText = "Verify"

  testCard = {
    smartCardNumber: ''
  }

  variations : ITVSubscriptionVariation[] = []


  rechargeForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    smartCardNumber: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    serviceID: new FormControl('dstv', [Validators.required]),
    variation_code: new FormControl('', [Validators.required]),
    amount: new FormControl(0)
  })
  
  alert = new Alert({
    temporary: true,
    life: 4000
  })

  user = new User();
  admin = new Admin();

  isAdmin = false;

  tvServices : IDatawayService[] = [];
  serviceVariations : IDatawayServiceVariation[] = [];
  
  constructor(
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
        this.datawayService.getServices({serviceCatSlug: q.service_category_slug}).then((resp: Feedback<any>) => {
          if (resp.success) {
            this.tvServices = resp.data!!;
            this.rechargeForm.setValue({
              ...this.rechargeForm.value,
              serviceID: this.tvServices[0].slug
            });
            this.getServiceVariations(this.tvServices[0].slug);
          } else {
            // display error message
            this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
          }
        })
      }
    })
  }

  async updateVariation() {
    this.validated = false;
    this.validationDetails = undefined
    this.btnText = "Verify";
    this.getServiceVariations(this.rechargeForm.value.serviceID);
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
          smartCardNumber: this.rechargeForm.value.smartCardNumber
        })
      } else {
        this.alert.showAlert({message: response.msg!!, severity: "error"})
      }
    })
  }

  updateAmount() {
    this.rechargeForm.setValue({
      ...this.rechargeForm.value,
      amount: this.serviceVariations.filter(v => v.slug === this.rechargeForm.value.variation_code)[0].amount
    })
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
      amount: String(this.serviceVariations.filter(v => v.slug === this.rechargeForm.value.variation_code)[0].amount),
      billerIdentifier: this.rechargeForm.value.smartCardNumber,
      variationSlug: this.rechargeForm.value.variation_code,
      serviceSlug: this.rechargeForm.value.serviceID
    }

    this.datawayService.vend(payload).then(r => {
      this.recharging = false;
      if (r.success) {
        this.alert.showAlert({message: r.msg!!, severity: "success"})
      } else {
        this.alert.showAlert({message: r?.data?.response_description?.replace('biller identifier', 'smart card number') || r.msg!!, severity: "error"})
      }
    }).catch(e => {
      this.recharging = false;
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

  async validate() {
    this.validating = true;
    this.datawayService.validateBiller({
      serviceSlug: this.rechargeForm.value.serviceID,
      variationSlug: this.rechargeForm.value.variation_code,
      billerIdentifier: this.rechargeForm.value.smartCardNumber
    }).then(r => {
      this.validating = false;

      if (r.success) {
        this.validated = true;
        this.validationDetails = r.data;  
        this.btnText = "Recharge";
        this.alert.showAlert({message: r.msg!!.replace("Biller validated", "Smart card number verified"), severity: "success"})
      } else {
        this.validated = false;
        this.validationDetails = undefined;
        this.btnText = "Verify";
        this.alert.showAlert({message: r?.data?.response_description?.replace('biller identifier', 'smart card number') || r.msg!!, severity: "error"})
      
      }
    }).catch(e => {
      this.validating = false;
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }
}
