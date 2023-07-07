import { Component } from '@angular/core';
// import { AddContactComponent } from '../add-contact/add-contact.component';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  public darkBackground = false;

  setBackgroundDark() {
    this.darkBackground = true;
  }
}

