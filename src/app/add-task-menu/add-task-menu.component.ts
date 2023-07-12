import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-task-menu',
  templateUrl: './add-task-menu.component.html',
  styleUrls: ['./add-task-menu.component.scss']
})
export class AddTaskMenuComponent {
  public subtaskInput: boolean = false;

  constructor(private location: Location) { }

  prioUrgent: boolean = false;
  prioMedium: boolean = false;
  prioLow: boolean = true;

  profileForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl('')
  });

  onSubmit() {

  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
    goBack(): void {
      this.location.back(); 
    }
}
