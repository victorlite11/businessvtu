import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IElectricityPayment } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ElectricityPaymentService {
  constructor(
    @Inject('ELECTRICITY_ENDPOINT') private endpoint: string,
    private http: HttpClient
  ) { }

  async recharge(payload: IElectricityPayment): Promise<any> {
    return this.http.post(`${this.endpoint}/recharge`, payload).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }

  async validate(payload: {serviceID: string, billersCode: string, type: 'prepaid' | 'postpaid'}): Promise<any> {
    return this.http.post(`${this.endpoint}/validate`, payload).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }
}
