import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from "../shared/services/auth.service";


/**
 * @class
 * The LoginComponent provides the functionality for user login into the application.
 * @property {FormGroup} loginForm - The form group instance for the login form.
 * @property {boolean} animationStopped - Flag indicating whether animation has been stopped.
 * @property {boolean} isEmailPasswordInvalid - Flag indicating whether entered email or password is invalid.
 * @property {FormControl} rememberMeControl - The form control instance for the 'Remember Me' checkbox.
 */
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
    * @param {FormBuilder} formBuilder - An instance of FormBuilder
    */
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }


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

    this.loginForm = this.formBuilder.group({
      email: [rememberedEmail || '', Validators.email],
      password: ['', Validators.required]
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
   * Handles the form submission. If the form is valid, it will:
   * - Store or remove the email value in localStorage based on the 'Remember Me' checkbox status.
   * - Attempt to sign in the user using the AuthService's signIn method with the entered email and password.
   * If the form isn't valid then a message appears for 3 seconds.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.rememberMeControl.value ? localStorage.setItem('email', email) : localStorage.removeItem('email');
      this.authService.signIn(email, password)
        .catch(() => {
          this.isEmailPasswordInvalid = true;
          setTimeout(() => {
            this.isEmailPasswordInvalid = false;
          }, 3000);
        });
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
