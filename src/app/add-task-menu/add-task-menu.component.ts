import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-add-task-menu',
  templateUrl: './add-task-menu.component.html',
  styleUrls: ['./add-task-menu.component.scss'],
  animations: [
    trigger('openCategories', [
      state('start', style({
        height: '44px',
        overflow: 'hidden',
      })),
      state('end', style({
        overflow: 'scroll',
        height: '*',
      })),
      transition('end <=> start', animate('200ms ease-in-out'))
    ]),
  ]
})

export class AddTaskMenuComponent implements OnInit {
  public subtaskInput: boolean = false;
  prioUrgent: boolean = false;
  prioMedium: boolean = false;
  prioLow: boolean = true;
  minDate: string;
  public isMenuOpen = false;

  constructor(private location: Location, private firestore: AngularFirestore) {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  taskForm = new FormGroup({
    profileForm: new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      assignedTo: new FormControl(''),
      dueDate: new FormControl(''),
      prio: new FormControl(''),
      subtasks: new FormControl('')
    }),
    categoryForm: new FormGroup({
      category: new FormControl(''),
      color: new FormControl('')
    })
  });
  

  onSubmit() {
    const newTask = {
      title: this.taskForm.controls.profileForm.get('title')?.value ?? '',
      description: this.taskForm.controls.profileForm.get('description')?.value ?? '',
      assignedTo: this.taskForm.controls.profileForm.get('assignedTo')?.value ?? '',
      dueDate: this.taskForm.controls.profileForm.get('dueDate')?.value ?? '',
      prio: this.taskForm.controls.profileForm.get('prio')?.value ?? '',
      subtasks: this.taskForm.controls.profileForm.get('subtasks')?.value ?? '',
      category: this.taskForm.controls.categoryForm.get('category')?.value ?? '',
      color: this.taskForm.controls.categoryForm.get('color')?.value ?? '',
    };

    this.firestore
      .collection('tasks')
      .add(newTask)
      .then(() => {
        console.log('Aufgabe erfolgreich in Firestore gespeichert.');
        this.location.back();
      })
      .catch((error) => {
        console.error('Fehler beim Speichern der Aufgabe:', error);
      });
      this.taskForm.controls.categoryForm.reset({ color: '#ff0000' });
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  goBack(): void {
    this.location.back();
  }

  toggleCategoryMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  

}
