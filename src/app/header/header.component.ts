import { Component } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";


/**
 * @class
 * HeaderComponent provides a header for the application with features like user authentication status and sign-out.
 * @property {boolean} isDropdownOpen - A boolean value indicating whether the dropdown is open or not.
 * @function showLogout - Toggles the display state of the logout dropdown.
 * @function onLogout - Calls the authentication service to sign out the user.
 * @function stopPropagation - Stops the propagation of the event to parent elements.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent {
  constructor(public authService: AuthService) { }

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
