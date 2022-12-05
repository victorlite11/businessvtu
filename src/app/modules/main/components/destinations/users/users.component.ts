import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { Feedback } from 'src/app/modules/shared/interfaces/main.interfaces';
import { UsersService } from 'src/app/modules/shared/services/users/users.service';
import { User, Admin } from '../../../component/profile/profile.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  user = new User();
  admin = new Admin();

  users : User[] = [];

  isAdmin = false;

  
  alert = new Alert({
    temporary: true,
    life: 4000
  })

  constructor(
    private usersService: UsersService,
    private msgService : MessageService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.getUsers();
  }

  async deleteUser(op: {phone: string}) {
    this.usersService.deleteUser({phone: op.phone}).then((response: Feedback<any>) => {
      if (response.success) {
        this.alert.showAlert({message: response.msg!!, severity: "success"})
        this.getUsers();
      } else {
        this.alert.showAlert({message: response.msg!!, severity: "error"})
      }
    }).catch(e => {
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

  async getUsers() {
    this.usersService.getUsers().then((r: Feedback<any>) => {
      if (r.success) {
        this.users = r.data;
      } else {
        this.alert.showAlert({message: r.msg!!, severity: "error"})
      }
    }).catch(e => {
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }
}
