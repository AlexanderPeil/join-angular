import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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

  constructor(public dialogRef: MatDialogRef<AddContactComponent>) { }

  onNoClick() {
    this.dialogRef.close();
  }

}
