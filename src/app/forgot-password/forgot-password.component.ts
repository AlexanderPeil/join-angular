import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  isError: boolean = false;
  isEmailSent: boolean = false;


/**
 * @param {AuthService} authService - An instance of AuthService for authentication services.
 * @param {Router} router - An instance of Router for routing.
 * @property {FormGroup} forgotPasswordForm - Form group for the forgot password form. 
 */
  constructor(private authService: AuthService, public router: Router) {
    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email])
    });
  }


  ngOnInit(): void { }


/**
 * Submits the form. 
 * If the email is valid, a forgot password email will be sent by authService. 
 * If the email sending is successful, the user is redirected to the login page after 2 seconds. 
 * If the user is not found, an error flag is set.
 */
  onSubmit() {
    const email = this.forgotPasswordForm.get('email')?.value;
    if (email) {
      this.authService.forgotPassword(email)
      .then(() => {
        this.isEmailSent = true;
        setTimeout(() => {
          this.router.navigate(['login']); 
        }, 2000); 
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          this.isError = true;
        }
      });
    }
  }  
}
