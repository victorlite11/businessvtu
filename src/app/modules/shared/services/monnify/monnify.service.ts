import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Feedback } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MonnifyService {
  constructor(
    private http: HttpClient,
    @Inject('MONNIFY_ENDPOINT') private monnifyEndpoint: string,
  ) { }

  async createReservedAccounts() : Promise<Feedback<any>> {
    return this.http.post(`${this.monnifyEndpoint}/reserved-accounts`, {}).toPromise().then((r: any) => {
      return r;
    })
  }

  async getReservedAccounts() : Promise<Feedback<any>> {
    return this.http.get(`${this.monnifyEndpoint}/reserved-accounts`, {}).toPromise().then((r: any) => {
      return r;
    })
  }
}
