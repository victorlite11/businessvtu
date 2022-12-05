import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { IAirtimeRecharge } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AirtimeRechargeService {

  constructor(
    @Inject('AIRTIME_ENDPOINT') private endpoint: string,
    private http: HttpClient
  ) { }

  async rechargeAirtime(payload: IAirtimeRecharge): Promise<any> {
    return this.http.post(`${this.endpoint}/recharge`, payload).toPromise().then(r => {
      return r;
    }).catch(e => {
      //error handling
      return e;
    })
  }
}
