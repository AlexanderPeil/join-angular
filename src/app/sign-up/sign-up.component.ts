import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      displayName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }


  onSubmit() {
    const displayName = this.signUpForm.value.displayName;
    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    
    if (displayName && email && password) {
      this.authService.signUp(displayName, email, password);
    } else {
      console.log('Display Name, email or password is not defined');
    }
  }
  
}
