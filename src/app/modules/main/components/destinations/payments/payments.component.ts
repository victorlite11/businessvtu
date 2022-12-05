import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { Feedback } from 'src/app/modules/shared/interfaces/main.interfaces';
import { UsersService } from 'src/app/modules/shared/services/users/users.service';
import { User, Admin } from '../../../component/profile/profile.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  user = new User();
  admin = new Admin();

  depositTokens : any[] = [];

  isAdmin = false;

  alert = new Alert({
    temporary: true,
    life: 4000
  })

  customerWalletFundingForm = new FormGroup({
    phone: new FormControl('', Validators.required),
    amount: new FormControl(0, Validators.required)
  })

  customers : {name: string, phone: string}[] = [];

  fetchingCustomers = false;
  funding = false;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.init();
  }
 
  async handleChange(e : any) {
    let index = e.index;

    if (index == 1 && this.customers.length == 0) {
      this.fetchingCustomers = true;
      const usersResp = await this.usersService.getUsers();
      console.log(usersResp);
      this.fetchingCustomers = false;
      if (usersResp.success) {
        this.customers = (<User[]>usersResp.data).map(c => {
          return {
            name: c.info.fullname,
            phone: c.info.phone
          }
        });
        this.customerWalletFundingForm.setValue({
          phone: this.customers[0].phone,
          amount: this.customerWalletFundingForm.value.amount
        })
      } else {
        this.customers = []
      }
    }
}

  async init() {
    this.fetchDepositTokens();
  }

  async deletePayment(op: {token: string}) {
    this.usersService.deleteDepositToken({token: op.token}).then((resp: Feedback<any>) => {
      if (resp.success) {
        this.alert.showAlert({message: "Payment claim deleted", severity: "success"});
        this.fetchDepositTokens();
      } else {
        this.alert.showAlert({message: "Unable to delete payment claim", severity: "error"})
      }
    }).catch(e => {
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

  async fetchDepositTokens() {
    this.usersService.getAllDepositTokens().then((r : Feedback<any>) => {
      if (r.success) {
        this.depositTokens = r.data?.map((d : any) => {
          d.date = new Date(d.date).toDateString();
          return d
        })
      } else {
        this.depositTokens = [];
      }
    }).catch(e => {
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

  async confirmPayment(op: {token: string}) {
    this.usersService.confirmPayment({token: op.token}).then((response: Feedback<any>) => {
      if(response.success) {
        this.alert.showAlert({message: response.msg!!, severity: "success"})
        this.fetchDepositTokens();
      } else {
        this.alert.showAlert({message: response.msg!!, severity: "error"})
      }
    }).catch(e => {
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

  async performAction() {
    this.funding = true;
    this.usersService.fundCustomerWallet(this.customerWalletFundingForm.value).then((resp: Feedback<any>) => {
      this.funding = false;
      this.alert.showAlert({message: resp.msg!!, severity: resp.success ? "success" : "error"});
    }).catch(e => {
      this.funding = false;
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

}
