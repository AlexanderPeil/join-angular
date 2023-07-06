import { Component } from '@angular/core';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {

  firstName:string = '';
  lastName:string = '';
  email:string = '';
  phone:string = '';

  onNoClick() {
    
  }

}
