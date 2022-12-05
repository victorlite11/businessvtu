import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './fragments/header/header.component';
import { OptionsComponent } from './fragments/options/options.component';
import { FooterComponent } from './fragments/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import {CarouselModule} from 'primeng/carousel';
import {MenuModule} from 'primeng/menu';
import { AvatarModule } from "primeng/avatar";
import { PasswordModule } from "primeng/password";
import {ButtonModule} from 'primeng/button';
import { DividerModule } from "primeng/divider";
import { AvatarGroupModule } from "primeng/avatargroup";
import { ServiceCardComponent } from './components/cards/service-card/service-card.component';
import { WhatsappFabComponent } from './components/whatsapp-fab/whatsapp-fab.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import {SpeedDialModule} from 'primeng/speeddial';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { AlertComponent } from './components/alert/alert.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TabViewModule } from 'primeng/tabview';
import {DialogModule} from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import { NotificationComponent } from './components/notification/notification.component';

const BASE_URL = 'https://cee-endpoints.vercel.app'
//const BASE_URL = "http://localhost:3000"
@NgModule({
  declarations: [
    HeaderComponent,
    OptionsComponent,
    FooterComponent,
    ServiceCardComponent,
    WhatsappFabComponent,
    ContactDetailsComponent,
    AlertComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CarouselModule,
    AvatarModule,
    DialogModule,
    PasswordModule,
    AvatarGroupModule,
    DividerModule,
    ButtonModule,
    FormsModule,
    MenuModule,
    InputNumberModule,
    MessagesModule,
    MessageModule,
    DynamicDialogModule,
    SpeedDialModule,
    TabViewModule
  ],
  exports: [
    HeaderComponent,
    OptionsComponent,
    FooterComponent,
    NotificationComponent,
    CarouselModule,
    InputNumberModule,
    AvatarModule,
    DynamicDialogModule,
    PasswordModule,
    MessagesModule,
    MessageModule,
    AvatarGroupModule,
    ServiceCardComponent,
    WhatsappFabComponent,
    DividerModule,
    ButtonModule,
    MenuModule,
    SpeedDialModule,
    ContactDetailsComponent,
    AlertComponent,
    TabViewModule
  ],
  providers: [
    Document,
    DialogService,
    {provide: 'AIRTIME_ENDPOINT', useValue: `${BASE_URL}/airtime-recharge`},
    {provide: 'DATA_SUBSCRIPTION_ENDPOINT', useValue: `${BASE_URL}/data-subscription`},
    {provide: 'TV_SUBSCRIPTION_ENDPOINT', useValue: `${BASE_URL}/tv-subscription`},
    {provide: 'ELECTRICITY_ENDPOINT', useValue: `${BASE_URL}/electricity-payment`},
    {provide: 'EDUCATION_ENDPOINT', useValue: `${BASE_URL}/education-payment`},
    {provide: 'SIGNIN_ENDPOINT', useValue: `${BASE_URL}/signin`},
    {provide: 'USERS_ENDPOINT', useValue: `${BASE_URL}/users`},
    {provide: 'ADMIN_ENDPOINT', useValue: `${BASE_URL}/admin`},
    {provide: 'NOTIFICATIONS_ENDPOINT', useValue: `${BASE_URL}/notifications`},
    {provide: 'TRANSACTIONS_ENDPOINT', useValue: `${BASE_URL}/transactions`},
    {provide: 'DATAWAY_ENDPOINT', useValue: `${BASE_URL}/dataway`},
    {provide: 'NEARLYFREE_ENDPOINT', useValue: `${BASE_URL}/nearlyfree`},
    {provide: 'ACCOUNT_ENDPOINT', useValue: `${BASE_URL}/account`},
    {provide: 'SIGNUP_ENDPOINT', useValue: `${BASE_URL}/signup`},
    {provide: 'MONNIFY_ENDPOINT', useValue: `${BASE_URL}/monnify`},
    {provide: 'AUTH_KEY_PROPERTY_NAME', useValue: "xQ9Qt2qRza6Qsd3Wa"},
    {provide: 'NOTIFICATION_KEY', useValue: "xQ9st2qRDa6Ssd3Wa"},
    {provide: 'ADMIN_STATUS_KEY', useValue: "ahdjflsjlf23t4ait45"},
    {provide: 'USER_PERSONAL_DETAILS_KEY', useValue: "A58DLadFJD3y7ujf"},
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true}
  ]
})
export class SharedModule { }
