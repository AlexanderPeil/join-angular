import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  animationStopped = false;
  checked = false;
  isEmailPasswordInvalid = false;


  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    setTimeout(() => {
      this.stopAnimation();
    }, 3000);

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }

  private stopAnimation(): void {
    this.animationStopped = true;
  }


  onSubmit() {
    this.isEmailPasswordInvalid = false;
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;

    this.authService.signIn(email, password)
      .catch(() => {
        this.isEmailPasswordInvalid = true; 
      });
  }


  handleCheckboxChange(): void {
    // this.checked = this.checkboxControl.value;
    console.log('Checkbox checked', this.checked);
  }


  onGuestLogin() {
    this.authService.signInAnonymously();
  }
}
