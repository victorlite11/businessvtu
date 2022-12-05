import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Feedback } from '../../interfaces/main.interfaces';

export interface ISignupPayload {
  fullname: string;
  phone: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject('AUTH_KEY_PROPERTY_NAME') private authkey: string,
    @Inject('ADMIN_STATUS_KEY') private adminkey: string,
    @Inject('SIGNIN_ENDPOINT') private signinEndpoint: string,
    @Inject('SIGNUP_ENDPOINT') private signupEndpoint: string,
  ) { }

  async signin(payload: {phone: string, password: string}) : Promise<Feedback<any>> {
    return this.http.post(this.signinEndpoint, payload).toPromise().then((r: any) => {
      if (r.success) {
        sessionStorage.setItem(this.authkey, r.data.token);
        console.log(r.data)
        if (r.data.hasOwnProperty('supremacy')) {
          sessionStorage.setItem(this.adminkey, 'admin')
        } else {
          sessionStorage.removeItem(this.adminkey);
        }
        return r;
      } else {
        sessionStorage.removeItem(this.adminkey);
        return r;
      }
    })
  }

  async signout(op: {endpoint: 'user-logout' | 'admin-logout'}) : Promise<Feedback<any>> {
    sessionStorage.removeItem(this.authkey);
    sessionStorage.removeItem(this.adminkey);
    return this.http.post(`${this.signinEndpoint}/${op.endpoint}`, {/* Requires nothing to sign users out */}).toPromise().then((r: any) => {
      if (r.success) {
        sessionStorage.removeItem(this.authkey);
        return r;
      } else {
        return r;
      }
    })
  }

  async signup(payload: ISignupPayload) : Promise<Feedback<any>> {
    return await this.http.post(this.signupEndpoint, payload).toPromise().then((r: any) => {
      if (r.success) {
        return r;
      } else {
        return r;
      }
    })
  }
}
