import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Feedback, INearlyFreePurchasePayload, INearlyFreeServiceNetwork, INearlyFreeServicePlan, NEARLYFREE_ENDPOINTS, NEARLYFREE_SERVICES } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class NearlyfreeService {

  constructor(
    private http: HttpClient,
    @Inject('NEARLYFREE_ENDPOINT') private nearlyfreeEndpoint: string,
  ) { }

  async purchase(payload: INearlyFreePurchasePayload) : Promise<Feedback<any>> {
    return this.http.post(`${this.nearlyfreeEndpoint}/${NEARLYFREE_ENDPOINTS.PURCHASE}`, payload).toPromise().then((r: any) => {
      return r;
    })
  }

  async getServiceNetworks(op: {service: NEARLYFREE_SERVICES}) : Promise<Feedback<INearlyFreeServiceNetwork[]>> {
    return this.http.get(`${this.nearlyfreeEndpoint}/${NEARLYFREE_ENDPOINTS.SERVICE}/${op.service}`).toPromise().then((r: any) => {
      console.log(r)
      return r;
    }) 
  } 

  async getServicePlans(op: {networkId: string}) : Promise<Feedback<INearlyFreeServicePlan[]>> {
    console.log(op)
    return this.http.get(`${this.nearlyfreeEndpoint}/${NEARLYFREE_ENDPOINTS.PLANS}?networkId=${op.networkId}`).toPromise().then((r: any) => {
      return r;
    }) 
  }
}
