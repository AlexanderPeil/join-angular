import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})


export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  userAlreadyExists = false;
  isPasswordTooShort = false;


  /**
    * Constructor for SignUpComponent
    * @param {AuthService} authService - An instance of AuthService.
    * @param {FormBuilder} formBuilder - An instance of FormBuilder.
    */
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) { }


  /**
   * Angular lifecycle hook that initializes the sign-up form.
   */
  ngOnInit() {
    this.handleSignupValidation();
  }


  handleSignupValidation() {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPasssword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });

  }


  /**
   * Sets userAlreadyExists to true and clears it after a delay.
   * @private
   */
  private handleUserExistsError() {
    this.userAlreadyExists = true;
    this.clearErrorAfterDelay(() => this.userAlreadyExists = false);
  }


  passwordMatchValidator(formGroup: FormGroup) {
    const password: string = formGroup.get('password')?.value;
    const confirmPassword: string = formGroup.get('confirmPasssword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPasssword')?.setErrors({ NoPassswordMatch: true });
    } else {
      formGroup.get('confirmPasssword')?.setErrors(null);
    }
  }


  /**
 * Sets isPasswordTooShort to true and clears it after a delay.
 * @private
 */
  private handleWeakPasswordError() {
    this.isPasswordTooShort = true;
    this.clearErrorAfterDelay(() => this.isPasswordTooShort = false);
  }


  /**
   * Clears the error after a delay.
   * @param {Function} callback - The function to be called after the delay.
   */
  private clearErrorAfterDelay(callback: Function) {
    setTimeout(() => {
      callback();
    }, 3000);
  }


  /**
   * Handles the form submission. If the form is valid, it attempts to sign up the user 
   * using the AuthService's signUp method with the entered display name, email, and password.
   * Also handles specific errors from the sign-up process.
   */
  onSubmit() {
    if (this.signUpForm.valid) {
      const { firstName, lastName, email, password } = this.signUpForm.value;
      this.authService.signUp(firstName, lastName, email, password)
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              this.handleUserExistsError();
              break;
            case "auth/weak-password":
              this.handleWeakPasswordError();
              break;
          }
        });
    }
  }
}
