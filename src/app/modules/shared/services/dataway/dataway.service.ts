import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Feedback, IDatawayBillerValidationPayload, IDatawayPaymentPayload, IDatawayService, IDatawayServiceCategory, IDatawayServiceVariation } from '../../interfaces/main.interfaces';

export enum DATAWAY_ENDPOINTS {
  SERVICE_CATEGORIES = "get-service-categories",
  SERVICES = "get-services",
  SERVICE_VARIATIONS = "get-service-variations",
  VALIDATE_BILLER = "validate-biller", 
  PAY = "vend",
  QUERY_TRANSACTION = "query-transaction",
  WALLET_BALANCE = "balance"
}

@Injectable({
  providedIn: 'root'
})
export class DatawayService {

  constructor(
    private http: HttpClient,
    @Inject('DATAWAY_ENDPOINT') private datawayEndpoint: string,
  ) { }

  async getBalance() : Promise<Feedback<string>> {
    return this.http.get(`${this.datawayEndpoint}/${DATAWAY_ENDPOINTS.WALLET_BALANCE}`).toPromise().then((r: any) => {
      return r;
    })
  }

  async getServiceCategories() : Promise<Feedback<IDatawayServiceCategory[]>> {
    return this.http.get(`${this.datawayEndpoint}/${DATAWAY_ENDPOINTS.SERVICE_CATEGORIES}`).toPromise().then((r: any) => {
      return r;
    })
  }

  async getServices(op: {serviceCatSlug: string}) : Promise<Feedback<IDatawayService[]>> {
    return this.http.get(`${this.datawayEndpoint}/${DATAWAY_ENDPOINTS.SERVICES}?slug=${op.serviceCatSlug}`).toPromise().then((r: any) => {
      return r;
    })
  }

  async getServiceVariations(op: {serviceSlug: string}) : Promise<Feedback<IDatawayServiceVariation[]>> {
    return this.http.get(`${this.datawayEndpoint}/${DATAWAY_ENDPOINTS.SERVICE_VARIATIONS}?service-slug=${op.serviceSlug}`).toPromise().then((r: any) => {
      return r;
    })
  }

  async vend(payload: IDatawayPaymentPayload) : Promise<Feedback<any>> {
    return this.http.post(`${this.datawayEndpoint}/${DATAWAY_ENDPOINTS.PAY}`, payload).toPromise().then((r: any) => {
      return r;
    })
  }

  async validateBiller(payload: IDatawayBillerValidationPayload) : Promise<Feedback<any>> {
    return this.http.post(`${this.datawayEndpoint}/${DATAWAY_ENDPOINTS.VALIDATE_BILLER}`, payload).toPromise().then((r: any) => {
      return r;
    })
  }
}
