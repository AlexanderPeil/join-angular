import { Component } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public  authService: AuthService) { }

  isDropdownOpen = false;


  showLogout() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  onLogout() {
    this.authService.signOut();
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  }

}
