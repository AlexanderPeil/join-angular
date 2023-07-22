// import { Component, OnInit } from '@angular/core';
// import { AuthService } from "../shared/services/auth.service";


// @Component({
//   selector: 'app-verify-email',
//   templateUrl: './verify-email.component.html',
//   styleUrls: ['./verify-email.component.scss']
// })
// export class VerifyEmailComponent implements OnInit {
//   animationStopped = false;

//   constructor(public  authService: AuthService) { }


//   ngOnInit(): void {
//     setTimeout(() => {
//       this.stopAnimation();
//     }, 3000);
//     this.sendVerificationMail();
//   }


//   sendVerificationMail() {
//     this.authService.sendVerificationMail()
//       .catch((error:any) => console.error('Error sending verification email: ', error));
//   }


//   private stopAnimation(): void {
//     this.animationStopped = true;
//   }
// }
