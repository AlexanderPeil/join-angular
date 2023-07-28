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
  isEmailPasswordInvalid = false;
  rememberMeControl = new FormControl(false);


/**
 * Constructor for LoginComponent
 * @param {AuthService} authService - An instance of AuthService
 */
  constructor(private authService: AuthService) { }


/**
 * Angular lifecycle hook that is called after data-bound properties of a directive are initialized.
 * Initializes the login form and sets up a delay for stopping an animation.
 */
  ngOnInit(): void {
    setTimeout(() => {
      this.stopAnimation();
    }, 3000);

    const rememberedEmail = localStorage.getItem('email');
    this.rememberMeControl.setValue(rememberedEmail !== null);

    this.loginForm = new FormGroup({
      email: new FormControl(rememberedEmail || '', Validators.email),
      password: new FormControl('', Validators.required)
    });
  }


/**
 * Stops the loading animation by setting `animationStopped` property to true.
 * @private
 */
  private stopAnimation(): void {
    this.animationStopped = true;
  }


/**
 * Handles the submit action of the login form.
 * If form is valid, calls AuthService's signIn method with the entered email and password.
 * If "remember me" is checked, stores the email in localStorage.
 */
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.rememberMeControl.value ? localStorage.setItem('email', email) : localStorage.removeItem('email');
      this.authService.signIn(email, password).catch(() => this.isEmailPasswordInvalid = true);
    }
  }


/**
 * Handles the guest login action.
 * Calls AuthService's signInAnonymously method.
 */
  onGuestLogin() {
    this.authService.signInAnonymously();
  }
}
