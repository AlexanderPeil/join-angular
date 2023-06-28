import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  animationStopped = false;
  checked = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.stopAnimation();
    }, 3000);
  }

  private stopAnimation(): void {
    this.animationStopped = true;
  }

  handleCheckboxChange(): void {
    console.log('Checkbox checked', this.checked);
    
  }

}
