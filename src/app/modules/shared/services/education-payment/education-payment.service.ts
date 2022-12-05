import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IEducationPayment } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class EducationPaymentService {

  constructor(
    @Inject('EDUCATION_ENDPOINT') private endpoint: string,
    private http: HttpClient
  ) { }

  async rechargeData(payload: IEducationPayment): Promise<any> {
    return this.http.post(`${this.endpoint}/recharge`, payload).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }

  async getVariations(serviceId: 'waec' | 'waec-registration'): Promise<any> {
    return this.http.get(`${this.endpoint}/variations?serviceID=${serviceId}`).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }
}
