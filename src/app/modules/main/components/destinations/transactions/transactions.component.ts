import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { Feedback, Transaction } from 'src/app/modules/shared/interfaces/main.interfaces';
import { UsersService } from 'src/app/modules/shared/services/users/users.service';
import { User, Admin } from '../../../component/profile/profile.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  user = new User();
  admin = new Admin();

  alert = new Alert({
    temporary: true,
    life: 4000
  })
  
  transactions : Transaction[] = [];
  heading = "All Customers Transactions";

  isAdmin = false;

  constructor(
    private usersService: UsersService,
    private route : ActivatedRoute,
    private msgService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async data => {
      if (data.self) {
        this.init({selfTrxs : true});
      } else {
        this.init({selfTrxs : false})
      }
      
    })
    
  }

  async init(op: {selfTrxs : boolean}) {

    if (op.selfTrxs) {
      this.heading = "My Transactions";
      this.usersService.getProfile().then((response: Feedback<any>) => {
        this.transactions = (<Transaction[]>response.data.transactions).map((trx : any) => {
          trx.date = new Date(trx.date).toDateString();
          return trx;
        })
      }).catch(e => {
        // display error message
        this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
      })
    } else {
      this.heading = "All Customers Transactions";
      this.getTransactions();
    }
    
  }

  async getTransactions() {
    this.usersService.getTransactions({phone: ""}).then((r : Feedback<any>) => {
      if (r.success) {
        this.transactions = r.data.map((trx : any) => {
          trx.date = new Date(trx.date).toDateString();
          return trx;
        });
        this.transactions.reverse();
      } else {
        this.alert.showAlert({message: r.msg!!, severity: "error"})
      }
    })
  }

}
