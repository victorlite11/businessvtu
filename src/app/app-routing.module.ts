import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirtimeRechargeComponent } from './modules/main/components/destinations/airtime-recharge/airtime-recharge.component';
import { LoginComponent } from './modules/main/components/destinations/auth/login/login.component';
import { SignupComponent } from './modules/main/components/destinations/auth/signup/signup.component';
import { DataSubscriptionComponent } from './modules/main/components/destinations/data-subscription/data-subscription.component';
import { EducationPaymentComponent } from './modules/main/components/destinations/education-payment/education-payment.component';
import { ElectricityPaymentComponent } from './modules/main/components/destinations/electricity-payment/electricity-payment.component';
import { ProfileComponent } from './modules/main/component/profile/profile.component';
import { TvSubscriptionComponent } from './modules/main/components/destinations/tv-subscription/tv-subscription.component';
import { HomeComponent } from './modules/main/components/home/home.component';
import { FundWalletComponent } from './modules/main/components/destinations/fund-wallet/fund-wallet.component';
import { PaymentsComponent } from './modules/main/components/destinations/payments/payments.component';
import { UsersComponent } from './modules/main/components/destinations/users/users.component';
import { TransactionsComponent } from './modules/main/components/destinations/transactions/transactions.component';
import { SettingsComponent } from './modules/main/components/destinations/settings/settings.component';
import { NotificationManagementComponent } from './modules/main/components/notification-management/notification-management.component';

const routes: Routes = [
  {path: '', children: [
    {path: '', component: HomeComponent},
    {path: 'dashboard', children: [
      {path: '', component: ProfileComponent},
      {path: 'fund-wallet', component: FundWalletComponent},
      {path: 'payments', component: PaymentsComponent},
      {path: 'users', component: UsersComponent},
      {path: 'manage-notifications', component: NotificationManagementComponent},
      {path: 'transactions', component: TransactionsComponent},
      {path: 'airtime-recharge', component: AirtimeRechargeComponent},
      {path: 'tv-subscription', component: TvSubscriptionComponent},
      {path: 'data-subscription', component: DataSubscriptionComponent},
      {path: 'education', component: EducationPaymentComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'electricity-payment', component: ElectricityPaymentComponent},
    ]},
    {path: 'auth', children: [
      {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignupComponent}
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
