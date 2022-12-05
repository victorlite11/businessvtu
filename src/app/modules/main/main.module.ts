import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { AirtimeRechargeComponent } from './components/destinations/airtime-recharge/airtime-recharge.component';
import { SharedModule } from '../shared/shared.module';
import { TvSubscriptionComponent } from './components/destinations/tv-subscription/tv-subscription.component';
import { DataSubscriptionComponent } from './components/destinations/data-subscription/data-subscription.component';
import { ElectricityPaymentComponent } from './components/destinations/electricity-payment/electricity-payment.component';
import { EducationPaymentComponent } from './components/destinations/education-payment/education-payment.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {DropdownModule} from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoginComponent } from './components/destinations/auth/login/login.component';
import { SignupComponent } from './components/destinations/auth/signup/signup.component';
import { ProfileComponent } from './component/profile/profile.component';
import { FundWalletComponent } from './components/destinations/fund-wallet/fund-wallet.component';
import { PaymentsComponent } from './components/destinations/payments/payments.component';
import { UsersComponent } from './components/destinations/users/users.component';
import { TransactionsComponent } from './components/destinations/transactions/transactions.component';
import { SettingsComponent } from './components/destinations/settings/settings.component';
import { NotificationManagementComponent } from './components/notification-management/notification-management.component';


@NgModule({
  declarations: [
    HomeComponent,
    AirtimeRechargeComponent,
    TvSubscriptionComponent,
    DataSubscriptionComponent,
    ElectricityPaymentComponent,
    EducationPaymentComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    FundWalletComponent,
    PaymentsComponent,
    UsersComponent,
    TransactionsComponent,
    SettingsComponent,
    NotificationManagementComponent
  ],
  providers: [
    MessageService
  ],
  imports: [
    CommonModule,
    SharedModule,
    InputTextModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    FormsModule,
    InputTextareaModule,
    ToastModule,
    RippleModule,
    DropdownModule
  ]
})
export class MainModule { }
