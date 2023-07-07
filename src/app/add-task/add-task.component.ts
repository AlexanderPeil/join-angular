import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  public subtaskInput: boolean = false;
  minDate: Date;
  maxDate: Date;
  subtask: string = '';
  public showInputSubtask: boolean = false;

  constructor() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date;
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  profileForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  onSubmit() {

  }

}
