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


  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    setTimeout(() => {
      this.stopAnimation();
    }, 3000);

    const rememberedEmail = localStorage.getItem('email');
    this.rememberMeControl.setValue(rememberedEmail !== null);
  
    this.loginForm = new FormGroup({
      email: new FormControl(rememberedEmail || '', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  private stopAnimation(): void {
    this.animationStopped = true;
  }


  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }
  
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;
  
    if(this.rememberMeControl.value) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }
  
    this.authService.signIn(email, password)
      .catch(() => {
        this.isEmailPasswordInvalid = true; 
      });
  }


  onGuestLogin() {
    this.authService.signInAnonymously();
  }
}
