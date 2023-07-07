import { Component } from '@angular/core';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  minDate: Date;
  maxDate: Date;
  subtask: string = '';
  public showInputSubtask: boolean = false;

  constructor() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date;
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

}
