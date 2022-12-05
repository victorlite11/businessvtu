import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ITVSubscription } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class TvSubscriptionService {

  constructor(
    @Inject('TV_SUBSCRIPTION_ENDPOINT') private endpoint: string,
    private http: HttpClient
  ) { }

  async rechargeData(payload: ITVSubscription): Promise<any> {
    return this.http.post(`${this.endpoint}/recharge`, payload).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }

  async getVariations(serviceId: 'dstv' | 'gotv' | 'startimes'): Promise<any> {
    return this.http.get(`${this.endpoint}/variations?network=${serviceId}`).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }

  async validate(payload: {serviceID: string, billersCode: string}): Promise<any> {
    return this.http.post(`${this.endpoint}/validate`, payload).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }
}
