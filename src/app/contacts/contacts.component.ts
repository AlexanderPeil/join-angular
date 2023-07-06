import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  animal: any;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    let dialogRef = this.dialog.open(AddContactComponent, {
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log('The dialog was closed');
      this.animal = result;
      
    });
  }
}

