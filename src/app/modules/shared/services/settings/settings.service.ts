import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Feedback, ICEE, ICEESettings } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient,
    @Inject('USERS_ENDPOINT') private usersEndpoint: string,
    @Inject('ADMIN_ENDPOINT') private adminEndpoint: string,
  ) { }

  async updateCEESetting(arg0: ICEESettings) : Promise<Feedback<any>> {
    return this.http.put(`${this.adminEndpoint}/cee`, arg0).toPromise().then((r: any) => {
      return r;
    })
  }

  async getCEESettings() : Promise<Feedback<any>> {
    return this.http.get(`${this.adminEndpoint}/cee-settings`).toPromise().then((r: any) => {
      return r;
    })
  }
  
}
