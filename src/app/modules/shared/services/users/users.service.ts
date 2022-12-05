import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Feedback, IMonnifyOnlinePayResponse } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  constructor(
    private http: HttpClient,
    @Inject('USERS_ENDPOINT') private usersEndpoint: string,
    @Inject('ADMIN_ENDPOINT') private adminEndpoint: string,
    @Inject('ACCOUNT_ENDPOINT') private acctEndpoint: string,
    @Inject('TRANSACTIONS_ENDPOINT') private trxEndpoint: string,
  ) { }

  async fundWithOnlinePayment(arg0: IMonnifyOnlinePayResponse) : Promise<Feedback<any>> {
    return this.http.post(`${this.acctEndpoint}/fund-wallet-with-monnify`, arg0).toPromise().then((r: any) => {
      return r;
    })
  }

  async fundCustomerWallet(op: {phone: string, amount: number}) : Promise<Feedback<any>> {
    return this.http.post(`${this.acctEndpoint}/fund-customer-wallet`, op).toPromise().then((r: any) => {
      return r;
    })
  }

  async getCEE() : Promise<Feedback<any>> {
    return this.http.get(`${this.adminEndpoint}/cee`).toPromise().then((r: any) => {
      return r;
    })
  }

  async withdrawCommission(payload : {amount: number}) : Promise<Feedback<any>> {
    return this.http.post(`${this.adminEndpoint}/withdraw-commission`, payload).toPromise().then((r: any) => {
      return r;
    })
  }

  async getTransactions(op : {phone: string}) : Promise<Feedback<any>> {
    return this.http.get(`${this.trxEndpoint}?phone=${op.phone}`).toPromise().then((r: any) => {
      return r;
    })
  }

  async getBalance() : Promise<Feedback<any>> {
    return this.http.get(`${this.acctEndpoint}/balance`).toPromise().then((r: any) => {
      return r;
    })
  }

  
  async getMyTransactions() : Promise<Feedback<any>> {
    return this.http.get(`${this.trxEndpoint}/self`).toPromise().then((r: any) => {
      return r;
    })
  }
  
  async getProfile() : Promise<Feedback<any>> {
    return this.http.get(`${this.usersEndpoint}/user-profile`).toPromise().then((r: any) => {
      return r;
    })
  }

  async getUsers() : Promise<Feedback<any>> {
    return this.http.get(`${this.usersEndpoint}`).toPromise().then((r: any) => {
      return r;
    })
  }

  async deleteUser(arg0: { phone: string; }) : Promise<Feedback<any>> {
    return this.http.delete(`${this.usersEndpoint}`, {body: {phone: arg0.phone}}).toPromise().then((r: any) => {
      return r;
    })
  }

  async createDepositToken(payload: {amount: number}) : Promise<Feedback<any>> {
    return this.http.post(`${this.acctEndpoint}/deposit-token`, payload).toPromise().then((r: any) => {
      return r;
    })
  }

  async getDepositToken() : Promise<Feedback<any>> {
    return this.http.get(`${this.acctEndpoint}/deposit-token`).toPromise().then((r: any) => {
      return r;
    })
  }

  async getCustomersBalance() : Promise<Feedback<number>> {
    return this.http.get(`${this.acctEndpoint}/customers-balance`).toPromise().then((r: any) => {
      return r;
    })
  }

  async deleteDepositToken(op: {token: string}) : Promise<Feedback<any>> {
    return this.http.delete(`${this.acctEndpoint}/deposit-token?token=${op.token}`).toPromise().then((r: any) => {
      return r;
    })
  }

  async getAllDepositTokens() : Promise<Feedback<any>> {
    return this.http.get(`${this.acctEndpoint}/all-deposit-tokens`).toPromise().then((r: any) => {
      return r;
    })
  }

  async confirmPayment(op: {token: string}) : Promise<Feedback<any>> {
    return this.http.post(`${this.acctEndpoint}/confirm-deposit`, op).toPromise().then((r: any) => {
      return r;
    })
  }
}
