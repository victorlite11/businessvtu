import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Alert } from 'src/app/modules/shared/components/alert/alert.component';
import { Feedback } from 'src/app/modules/shared/interfaces/main.interfaces';
import { AuthService } from 'src/app/modules/shared/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    'fullname': new FormControl('', [Validators.required]),
    'phone': new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    'email': new FormControl('', [Validators.email]),
    'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(6)]),
    'remember': new FormControl(false)
  })
  passMatch = false;

    alert = new Alert({
    temporary: true,
    life: 4000
  })
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
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

  confirmPasswordsEquality() {
    if (this.signupForm.value.confirmPassword === this.signupForm.value.password) {
      this.passMatch = true;
    } else {
      this.passMatch = false;
    }
  }


  async signup() {
    this.authService.signup({
      phone: this.signupForm.value.phone,
      password: this.signupForm.value.password,
      email: this.signupForm.value.email,
      fullname: this.signupForm.value.fullname
    }).then((signupResponse: Feedback<any>) => {
      if (signupResponse.success) {
        this.alert.showAlert({message: signupResponse.msg!!, severity: "success"})
        this.navigate('auth/login');
      } else {
        this.alert.showAlert({message: signupResponse.msg!!, severity: "error"})
      }
    }).catch(e => {
      // display error message
      this.alert.showAlert({message: "Network problem. Please check your internet connection", severity: "error"})
    })
    

  }

}
