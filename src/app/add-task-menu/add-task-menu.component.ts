import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-add-task-menu',
  templateUrl: './add-task-menu.component.html',
  styleUrls: ['./add-task-menu.component.scss']
})
export class AddTaskMenuComponent {
  public subtaskInput: boolean = false;

  profileForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  onSubmit() {

  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  // minDate: Date;
  // maxDate: Date;
  // subtask: string = '';
  // public showInputSubtask: boolean = false;

  // constructor(public dialogRef: MatDialogRef<AddTaskMenuComponent>) {
  //   const currentYear = new Date().getFullYear();
  //   this.minDate = new Date;
  //   this.maxDate = new Date(currentYear + 1, 11, 31);
  // }

  // onNoClick() {
  //   this.dialogRef.close();
  // }

}
