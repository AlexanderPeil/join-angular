import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  greeting = '';
  username = '';

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.setUsername();
    this.setGreeting();
  }


  
  setUsername() {
    const user = this.authService.userData;
    this.username = user?.displayName || 'Guest';
  }


  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good morning';
    } else if (hour < 17) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

}
