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


  constructor(private authService: AuthService, public router: Router) {
    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email])
    });
  }


  ngOnInit(): void { }


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
