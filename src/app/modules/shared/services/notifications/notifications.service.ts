import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Feedback, INotification } from '../../interfaces/main.interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(
    private http: HttpClient,
    @Inject('NOTIFICATIONS_ENDPOINT') private notificationsEndpoint: string,
  ) { }

  async createNotification(payload: INotification) : Promise<Feedback<any>> {
    return this.http.post(`${this.notificationsEndpoint}`, payload).toPromise().then((r: any) => {
      return r;
    })
  }

  async updateNotification(payload: INotification) : Promise<Feedback<any>> {
    return this.http.put(`${this.notificationsEndpoint}`, payload).toPromise().then((r: any) => {
      return r;
    })
  }

  async deleteNotification(payload : {id : string}) : Promise<Feedback<any>> {
    return this.http.delete(`${this.notificationsEndpoint}/${payload.id}`).toPromise().then((r: any) => {
      return r;
    })
  }

  async getNotifications() : Promise<Feedback<any>> {
    return this.http.get(`${this.notificationsEndpoint}`).toPromise().then((r: any) => {
      return r;
    })
  }
}
