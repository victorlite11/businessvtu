import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Inject,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';
import { User } from 'src/app/modules/main/component/profile/profile.component';
import { DatawayService } from '../../services/dataway/dataway.service';
import { ICEE } from '../../interfaces/main.interfaces';
import { Alert } from '../../components/alert/alert.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() title = 'CEE';
  @Input() canMoveBack: boolean = false;
  @Input() isProfileHeader: boolean = false;
  @Input() isBalanceHeader: boolean = false;
  @Input() isAdmin: boolean = false;
  @Input() iconLabel: string = 'U';
  @Input() fullname: string = 'User Name';
  @Input() isLoggedIn: boolean = false;
  @Input() balance: string = '0';

  customersBalance = '0';
  datawayngBalance = '0';

  alert = new Alert({
    temporary: true,
    life: 4000,
  });

  items: MenuItem[] = [];

  withdrawingCommission = false;

  commissionAmountToWithdraw = 0;

  cee: ICEE = {
    account: {
      commissionBal: 0,
    },
    settings: {
      commissionSetting: {
        datasubCharge: 1,
        tvsubCharge: 1,
      },
    },
  };

  shouldWithdrawCommission = false;

  constructor(
    private location: Location,
    private authService: AuthService,
    private usersService: UsersService,
    private datawayService: DatawayService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject('AUTH_KEY_PROPERTY_NAME') private authkey: string,
    @Inject('ADMIN_STATUS_KEY') private adminkey: string
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setup();
  }

  ngOnInit(): void {
    this.setup();
  }

  private setup() {
    this.isLoggedIn = sessionStorage.getItem(this.authkey) ? true : false;

    if (this.isLoggedIn) {
      // update menu
      this.items = [
        {
          label: 'Settings',
          command: async (ev) => {
            await this.navigate('dashboard/settings');
          },
        },
        {
          label: 'Sign out',
          command: async (ev) => {
            await this.signout();
          },
        },
      ];

      // if profileHeader, the balance will come with the user Data object retrieved
      if (this.isBalanceHeader || this.isProfileHeader) {
        // own balance
        this.usersService.getBalance().then((r) => {
          this.balance = r.success ? Number(r.data).toFixed(2) : this.balance;
        });
      }

      // is user admin or not
      this.isAdmin = sessionStorage.getItem(this.adminkey) ? true : false;

      if (this.isAdmin) {
        this.title = this.title == 'CEE' ? 'CEE Manager' : this.title;

        this.items.unshift({
          label: 'Manage Notifications',
          command: (ev) => {
            this.navigate('dashboard/manage-notifications');
          },
        });

        if (this.isProfileHeader) {
          this.usersService.getCEE().then((r) => {
            this.cee = r.data;
            this.commissionAmountToWithdraw = this.cee.account.commissionBal;
          });
        }

        // get customersBalance
        if (this.location.path() == '/dashboard') {
          this.usersService.getCustomersBalance().then((r) => {
            this.customersBalance = r.data ? r.data.toFixed(2) : '0';
          });

          // get datawayng wallet balance
          this.datawayService.getBalance().then((r) => {
            if (r.success) {
              this.datawayngBalance = r.data as string;
            } else {
              this.datawayngBalance = this.datawayngBalance;
            }
          });
        }
      }
    } else {
      // update menu
      this.items = [
        {
          label: 'Sign In',
          command: (ev) => {
            this.navigate('auth/login');
          },
        },
        {
          label: 'Sign Up',
          command: (ev) => {
            this.navigate('auth/signup');
          },
        },
      ];
    }
  }

  navigate(destination: string) {
    if (destination == '' && this.isLoggedIn) {
      // navigate to profile
      this.router.navigate(['dashboard'], {
        relativeTo: this.route.parent?.parent,
      });
    } else {
      if (this.title == 'CEE' || 'CEE Manager') {
        this.router.navigate([destination], {
          relativeTo: this.route.parent?.parent,
        });
      }
    }
  }

  toggleShouldWithdrawCommission() {
    this.shouldWithdrawCommission = !this.shouldWithdrawCommission;
  }

  moveBack() {
    this.location.back();
  }

  async withdrawCommission() {
    this.withdrawingCommission = true;
    this.usersService
      .withdrawCommission({ amount: this.commissionAmountToWithdraw })
      .then((resp) => {
        this.withdrawingCommission = false;

        if (resp.success) {
          this.alert.showAlert({ message: resp.msg!!, severity: 'success' });
          this.usersService.getCEE().then((r) => {
            this.cee = r.data;
            this.commissionAmountToWithdraw = this.cee.account.commissionBal;
          });
          this.shouldWithdrawCommission = false;
        } else {
          this.alert.showAlert({ message: resp.msg!!, severity: 'error' });
        }
      })
      .catch((e) => {
        this.withdrawingCommission = false;
        // display error message
        this.alert.showAlert({
          message: 'Network problem. Please check your internet connection',
          severity: 'error',
        });
      });
  }

  async signout() {
    const response = this.isAdmin
      ? await this.authService.signout({ endpoint: 'admin-logout' })
      : await this.authService.signout({ endpoint: 'user-logout' });
    if (response.success) {
      this.isLoggedIn = false;
      this.navigate('');
    }
  }
}
