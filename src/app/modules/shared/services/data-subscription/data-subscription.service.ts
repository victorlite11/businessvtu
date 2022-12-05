import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IDataRecharge } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataSubscriptionService {

  constructor(
    @Inject('DATA_SUBSCRIPTION_ENDPOINT') private endpoint: string,
    private http: HttpClient
  ) { }

  async rechargeData(payload: IDataRecharge): Promise<any> {
    return this.http.post(`${this.endpoint}/recharge`, payload).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }

  async getVariations(serviceId: 'mtn-data' | 'glo-data' | 'airtel-data' | 'etisalat-data'): Promise<any> {
    return this.http.get(`${this.endpoint}/variations?network=${serviceId}`).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }
}
