import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { Feedback } from 'src/app/modules/shared/interfaces/main.interfaces';
import { AuthService } from 'src/app/modules/shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    'phone': new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    'remember': new FormControl(false)
  })

  msgs : Message[] = [];

  
  alert = new Alert({
    temporary: true,
    life: 4000
  })
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private msgService: MessageService,
    @Inject('AUTH_KEY_PROPERTY_NAME') private authkey: string,
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem(this.authkey)) {
      this.navigate('dashboard')
    }
  }

  navigate(destination: string) {
    this.router.navigate([destination], {
      relativeTo: this.route.parent?.parent
    })
  }

  async login() {
    this.authService.signin({password: this.loginForm.value.password, phone: this.loginForm.value.phone}).then((signinResponse : Feedback<any>) => {
      if (signinResponse.success) {
        this.navigate('dashboard');
      } else {
        this.alert.showAlert({message: "Incorrect login details", severity: "error"})
      }
    }).catch(e => {
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })

  }
}
