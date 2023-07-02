import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  animationStopped = false;
  checked = false;
  checkboxControl = new FormControl();

  ngOnInit(): void {
    setTimeout(() => {
      this.stopAnimation();
    }, 3000);
  }

  private stopAnimation(): void {
    this.animationStopped = true;
  }

  handleCheckboxChange(): void {
    this.checked = this.checkboxControl.value;
    console.log('Checkbox checked', this.checked);
    
  }

  // public linkToSignUp = '/sign-up';

}
