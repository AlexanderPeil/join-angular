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
        height: '0',
        display: 'none',
        overflow: 'hidden',
      })),
      state('end', style({
        overflow: 'auto',
        height: '*',
        width: '100%',
        display: 'block',
      })),
      transition('end <=> start', animate('200ms ease-in-out'))
    ]),
    trigger('openAssignedTo', [
      state('start', style({
        height: '0',
        display: 'none',
        overflow: 'hidden',
      })),
      state('end', style({
        overflow: 'auto',
        height: '*',
        width: '100%',
        display: 'block',
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
  categoryMenu = false;
  assignedToMenu = false;

  constructor(private location: Location, private firestore: AngularFirestore) {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
  }

  setPriority(priority: string) {
    this.prioUrgent = priority === 'urgent';
    this.prioMedium = priority === 'medium';
    this.prioLow = priority === 'low';
  
    const profileForm = this.taskForm.controls['profileForm'] as FormGroup;
    profileForm.controls['prio'].setValue(priority);
  }

  taskForm = new FormGroup({
    profileForm: new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      assignedTo: new FormControl(''),
      date: new FormControl(''),
      prio: new FormControl('low'),
      subtasks: new FormControl('')
    }),
    categoryForm: new FormGroup({
      category: new FormControl(''),
      color: new FormControl('')
    })
  });


  onSubmit() {
    const profileForm = this.taskForm.controls['profileForm'] as FormGroup;
    const categoryForm = this.taskForm.controls['categoryForm'] as FormGroup;

    const newTask = {
      title: profileForm.controls['title'].value ?? '',
      description: profileForm.controls['description'].value ?? '',
      assignedTo: profileForm.controls['assignedTo'].value ?? '',
      date: profileForm.controls['date'].value ?? '',
      prio: profileForm.controls['prio'].value ?? '',
      subtasks: profileForm.controls['subtasks'].value ?? '',
      category: categoryForm.controls['category'].value ?? '',
      color: categoryForm.controls['color'].value ?? '',
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
    this.categoryMenu = !this.categoryMenu;
  }

  toggleAssignedToMenu() {
    this.assignedToMenu = !this.assignedToMenu;
  }

  resetCategory() {
    this.taskForm.get('categoryForm')?.get('category')?.setValue('');
  }
  
  

}
