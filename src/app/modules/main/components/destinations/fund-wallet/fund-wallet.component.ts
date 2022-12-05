import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { Feedback, IMonnifyReservedAccount, INotification, notificationsViewStatus } from 'src/app/modules/shared/interfaces/main.interfaces';
import { ScriptInjectorService } from 'src/app/modules/shared/services/script-injector/script-injector.service';
import { UsersService } from 'src/app/modules/shared/services/users/users.service';
import {Location} from "@angular/common";
import { MonnifyService } from 'src/app/modules/shared/services/monnify/monnify.service';
import { DialogService } from 'primeng/dynamicdialog';
import { NotificationComponent } from 'src/app/modules/shared/components/notification/notification.component';
import { NotificationsService } from 'src/app/modules/shared/services/notifications/notifications.service';

interface MyWindow extends Window {
  MonnifySDK : {
    initialize(options: Partial<any>) : any
  };
}

declare var window: MyWindow;

@Component({
  selector: 'app-fund-wallet',
  templateUrl: './fund-wallet.component.html',
  styleUrls: ['./fund-wallet.component.scss']
})
export class FundWalletComponent implements OnInit {

  fundingForm = new FormGroup({
    amount: new FormControl(null, [Validators.required, Validators.min(50)])
  })

  accountDetails = {
    accountNumber: '2026574293',
    accountName: "Monday Alilu Daikwo",
    bankName: "Kuda Bank"
  }

  fetchingReservedAccounts = false;
  reservedAccounts : IMonnifyReservedAccount[] = [];

  depositToken : any;

  alert = new Alert({
    temporary: true,
    life: 4000
  })

  isAdmin = false;
  private monnifySDKSrc = "https://sdk.monnify.com/plugin/monnify.js";
  notificationsViewStatus = notificationsViewStatus
  notification : INotification = {body: "", target: "dashboard"}
  notificationVisibility = false;
  constructor(
    private usersService: UsersService,
    private scriptInjector : ScriptInjectorService,
    private renderer : Renderer2,
    private monnifyService : MonnifyService,
    private location : Location,
    @Inject('USER_PERSONAL_DETAILS_KEY') private userPersonalDetailsKey: string,
    public dialogService : DialogService,
    private notificationsService: NotificationsService,
    @Inject('NOTIFICATION_KEY') private notificationkey: string,
  ) { }

  ngOnInit(): void {
    this.scriptInjector.injectJSScript(this.renderer, this.monnifySDKSrc, 'monnify-sdk-script-container');
    this.init();
    
  }

  async init() {
    
    this.getVirtualAccounts()

    this.notificationsService.getNotifications().then(r => {

      const notificationsViewStatus = sessionStorage.getItem(this.notificationkey);
      if (notificationsViewStatus) {
        console.log(r)
        const n = JSON.parse(notificationsViewStatus);
        if (!n.fundWallet) {
          console.log('endtered here')
          let actualNotification = r.data.filter((n : any) => n.target == "fund-wallet");
          console.log(actualNotification)
          if (actualNotification.length > 0) {
            n.fundWallet = true;
            sessionStorage.setItem(this.notificationkey, JSON.stringify(n));
            this.notification = actualNotification[0];
            this.notificationVisibility = true; 
          }
        }
      } else {
        let actualNotification = r.data.filter((n : any) => n.target == "fund-wallet")
        if (actualNotification.length > 0) {
          this.notificationsViewStatus.fundWallet = true;
          sessionStorage.setItem(this.notificationkey, JSON.stringify(this.notificationsViewStatus));
          this.notification = actualNotification[0];
          this.notificationVisibility = true;
        }
      }
    })
  }

  async createVirtualAccounts() {
    this.fetchingReservedAccounts = true;
    this.monnifyService.createReservedAccounts().then(r => {
      this.fetchingReservedAccounts = true;
      if (r.success) {
        this.alert.showAlert({message: r.msg!!, severity: "success"})
        this.getVirtualAccounts();
      } else {
        this.alert.showAlert({message: r.msg!!, severity: "error"})
      }
    }).catch(e => {
      this.fetchingReservedAccounts = false;
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

  async getVirtualAccounts() {
    this.fetchingReservedAccounts = true;
    this.monnifyService.getReservedAccounts().then(r => {
      this.fetchingReservedAccounts = false;
      console.log(r);
      if (r.success) {
        this.reservedAccounts = r.data
      }
    }).catch(e => {
      this.fetchingReservedAccounts = false;
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

  async fundWallet() {
    this.usersService.createDepositToken({amount: this.fundingForm.value.amount}).then(response => {
      if (response.success) {
        this.alert.showAlert({message: "Payment claim registered. awaiting confirmation", severity: "success"})
        this.depositToken = response.data;
        this.depositToken.date = new Date(this.depositToken.date).toDateString();
      } else {
        this.alert.showAlert({message: response.msg!!, severity: "error"})
      }
    }).catch(e => {
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

  async cancelFunding() {
    this.usersService.deleteDepositToken({token: this.depositToken.token}).then((response: Feedback<any>) => {
      if (response.success) {
        this.alert.showAlert({message: "Payment claim canceled successfully", severity: "success"})
        this.depositToken = undefined;
      } else {
        this.alert.showAlert({message: response.msg!!, severity: "error"})
      }
    }).catch(e => {
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
  }

  copy(what: string, msg: string) {
    navigator.clipboard.writeText(what).then(() => {
      this.alert.showAlert({message: msg, severity: "success"})
    }, () => {
      /* clipboard write failed */
      this.alert.showAlert({message: "Failed to copy to clipboard", severity: "error"})
    }); 
  }

  payWithMonnify() {
    const user = sessionStorage.getItem(this.userPersonalDetailsKey) ? JSON.parse(sessionStorage.getItem(this.userPersonalDetailsKey)!!) : null;

    if (!user) {
      this.alert.showAlert({message: "Unable to initialize payment process. Required information not available", severity: "error"})
      return;
    }

    window.MonnifySDK!!.initialize({
			amount: this.fundingForm.value.amount,
			currency: "NGN",
			reference: '' + Math.floor((Math.random() * 1000000000) + 1),
			customerName: user.fullname,
			customerEmail: user.email,
			apiKey: "MK_PROD_FUYQJUD89N",
			contractCode: "039522154437",
			paymentDescription: "CEE Wallet Fund",
			isTestMode: false,
		    metadata: {
                    "name": user.fullname,
                    "age": 25
            },
			paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],

			onComplete: (response : any) => {
				//Implement what happens when transaction is completed.
	 			if (response.paymentStatus == 'PAID') {
           this.usersService.fundWithOnlinePayment({
             paymentRef: response.paymentReference,
             amountPaid: response.amountPaid,
             transactionRef: response.transactionReference,
             transactionHash: response.transactionHash
           }).then(r => {
             if(r.success) {
              this.location.back();
              this.alert.showAlert({message: r.msg!!, severity: "success"})
             } else {
               // error message
             }
           })
         } else {
          this.alert.showAlert({message: "Transaction not successful", severity: "error"})
         }
			},

			onClose: (data : any) => {
				//Implement what should happen when the modal is closed here
        if (data.paymentStatus == 'USER_CANCELLED') {
          this.alert.showAlert({message: "Transaction canceled", severity: "error"})
        }
			}
		});
  }

}
