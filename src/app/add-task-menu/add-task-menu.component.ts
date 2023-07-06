import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task-menu',
  templateUrl: './add-task-menu.component.html',
  styleUrls: ['./add-task-menu.component.scss']
})
export class AddTaskMenuComponent {
  minDate: Date;
  maxDate: Date;

  constructor(public dialogRef: MatDialogRef<AddTaskMenuComponent>) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date;
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
