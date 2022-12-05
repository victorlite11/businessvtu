import { Component, Inject, OnInit } from '@angular/core';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { ICEE, ICEESettings } from 'src/app/modules/shared/interfaces/main.interfaces';
import { SettingsService } from 'src/app/modules/shared/services/settings/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  updating = false
  fetching = false;
  title = "Settings"
  alert = new Alert({
    temporary: true,
    life: 4000
  })
  ceeSettings : ICEESettings = {
    commissionSetting: {
      datasubCharge : 0,
      tvsubCharge : 0
    }
  }
  isAdmin = false;
  isLoggedIn = false;
  constructor(
    private settingsService : SettingsService,
    @Inject('AUTH_KEY_PROPERTY_NAME') private authkey: string,
    @Inject('ADMIN_STATUS_KEY') private adminkey: string,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = sessionStorage.getItem(this.authkey) ? true : false;

    if (this.isLoggedIn) {
      // is user admin or not
      this.isAdmin = sessionStorage.getItem(this.adminkey) ? true : false; 

      if (this.isAdmin) {
        this.fetching = true;
        this.settingsService.getCEESettings().then(r => {
          this.fetching = false;
          if (r.success) {
            this.ceeSettings = r.data
          }
        }) 
      } 
    }
  }

  async updateSettings() {
    this.updating = true;
    this.settingsService.updateCEESetting(this.ceeSettings).then(resp => {
      this.updating = false;
      this.alert.showAlert({message: resp.msg!!, severity: resp.success ? "success" : "error"});
    })
  }

}
