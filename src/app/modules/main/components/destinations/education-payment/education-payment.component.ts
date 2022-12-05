import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IEducationPayment, IEducationPaymentVariation } from 'src/app/modules/shared/interfaces/main.interfaces';
import { EducationPaymentService } from 'src/app/modules/shared/services/education-payment/education-payment.service';

@Component({
  selector: 'app-education-payment',
  templateUrl: './education-payment.component.html',
  styleUrls: ['./education-payment.component.scss']
})
export class EducationPaymentComponent implements OnInit {
  title = 'Education Payment'
  recharging = false;
  fetchingVariations = false;

  token = '';

  variations : IEducationPaymentVariation[] = []

  networkOptions = [
    { name: "WAEC Result Checker PIN", value: 'waec' },
    { name: "WAEC Registration PIN", value: 'waec-registration' }
  ];

  rechargeForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    amount: new FormControl(0, [Validators.required, Validators.min(0)]),
    serviceID: new FormControl('dstv', [Validators.required]),
    variation_code: new FormControl('', [Validators.required])
  })
  constructor(
    private educationPaymentService: EducationPaymentService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.getServiceVariation('waec')
  }

  async updateVariation() {
    this.getServiceVariation(this.rechargeForm.value.serviceID)
  }

  async getServiceVariation(serviceID: 'waec' | 'waec-registration'): Promise<any> {
    this.fetchingVariations = true;
    this.educationPaymentService.getVariations(serviceID).then((response: any) => {
      this.fetchingVariations = false;
      if (response.response_description == '000') {
        this.variations = response.content.varations
        this.rechargeForm.setValue({
          ...this.rechargeForm.value,
          variation_code: this.variations[0].variation_code,
          amount: Number(this.variations[0].variation_amount)
        })
      } else {
        this.messageService.add({severity:'error', detail: "Network problem. Please check your internet connection"});
      }
    })
  }

  updateVariationAmount() {
    this.rechargeForm.setValue({
      ...this.rechargeForm.value,
      amount: Number(this.variations.filter(v => v.variation_code == this.rechargeForm.value.variation_code)[0].variation_amount)
    })
  }

  async recharge() {
    this.recharging = true;
    this.educationPaymentService.rechargeData(this.rechargeForm.value).then(r => {
      this.recharging = false;
      if (r.code == '000') {
        this.token = r.tokens[0];
        this.messageService.add({severity:'success', detail: r.response_description});
      } else {
        this.messageService.add({severity:'error', detail:r.response_description || "Could not process request. Please retry"});
      }
    }).catch(e => {
      this.recharging = false;
    })
  }
}
