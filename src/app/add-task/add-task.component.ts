import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable  } from 'rxjs';
import { TaskInterface } from '../modellInterface';
import { DataService  } from '../data-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
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
        display: 'flex',
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
        display: 'flex',
      })),
      transition('end <=> start', animate('200ms ease-in-out'))
    ]),
  ]
})


export class AddTaskComponent {
  subtaskInput: boolean = false;
  contacts$: Observable<any[]>;
  categories$: Observable<any[]>;
  selectedCategory: any;
  taskAdded: boolean = false;


  prioUrgent: boolean = false;
  prioMedium: boolean = false;
  prioLow: boolean = true;

  minDate: string;
  categoryMenu = false;
  assignedToMenu = false;

  feedbackMessageMembers = 'Select your Members';
  createdSubtasks: string[] = [];


  /**
   * @param {Location} location - Location instance. 
   * @param {AngularFirestore} firestore - Firestore instance. 
   */
  constructor(
    private firestore: AngularFirestore, 
    private dataService: DataService, 
    private router: Router) {
    this.minDate = new Date().toISOString().split('T')[0];
    this.contacts$ = this.dataService.getContacts();
    this.categories$ = this.dataService.getCategories();    
  }


  ngOnInit(): void {

  }


  /**
   * Method to set priority of task.
   * 
   * @param {string} priority - The priority of the task. 
   */
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
      assignedTo: new FormArray([]),
      date: new FormControl(''),
      prio: new FormControl('low'),
      subtasks: new FormArray([])
    }),
    categoryForm: new FormGroup({
      category: new FormControl(''),
      color: new FormControl('#ff0000')
    })
  });


  /**
   * Method to submit the form and create a new task.
   */
  async onSubmit() {
    const profileForm = this.taskForm.controls['profileForm'] as FormGroup;
    const categoryForm = this.taskForm.controls['categoryForm'] as FormGroup;

    let category = categoryForm.controls['category'].value;
    if (!category) {
      category = this.selectedCategory.category;

    }

    let color = categoryForm.controls['color'].value;
    if (!color) {
      color = this.selectedCategory.color; 
    }
  
    const newTask: TaskInterface  = {
      title: profileForm.controls['title'].value ?? '',
      description: profileForm.controls['description'].value ?? '',
      assignedTo: profileForm.controls['assignedTo'].value ?? '',
      date: profileForm.controls['date'].value ?? '',
      prio: profileForm.controls['prio'].value ?? '',
      subtasks: this.createdSubtasks,
      category: category,
      color: color,
      status: 'todo',
    };
  
    try { 
      await this.dataService.addTask(newTask);
      console.log('Aufgabe erfolgreich in Firestore gespeichert.');
    } catch (error) {
      console.error('Fehler beim Speichern der Aufgabe oder Kategorie:', error);
      return;
    }
  
    // this.addCategory(categoryForm.controls['category'].value, categoryForm.controls['color'].value);
    this.taskForm.controls.categoryForm.reset({ color: '#ff0000' });
  }


  async onSubmitAndNavigate() {
    if (this.taskForm.valid) {
      this.onSubmit();
      this.taskAdded = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.taskAdded = false;  
      this.router.navigate(['/board']);
    } else {
      console.log('Was machst du da????');
    }
  }
  
  

  selectCategory(cat: any) {
    const categoryForm = this.taskForm.controls['categoryForm'] as FormGroup;
    categoryForm.controls['category'].setValue(cat.category);
    categoryForm.controls['color'].setValue(cat.color);
    this.selectedCategory = cat; 
    this.categoryMenu = false;
  }
  


  async addCategory(category: string, color: string) {
    try {
      await this.dataService.addCategoryFromService(category, color);
      console.log('Kategorie erfolgreich in Firestore gespeichert.');
    } catch (error) {
      console.error('Fehler beim Speichern der Kategorie:', error);
    }
  }
  
  
  categorySelected() {
    let categoryValue = this.taskForm.get('categoryForm.category')?.value;
    let colorValue = this.taskForm.get('categoryForm.color')?.value;
  
    if (categoryValue && colorValue) {
      let newCategory = {
        category: categoryValue,
        color: colorValue
      };
      this.saveCategory(newCategory);
      this.selectedCategory = newCategory;
      this.toggleCategoryMenu();
    } else {
      console.error('Fehler: Kategorie und/oder Farbe fehlen.');
    }
  }
  
  saveCategory(category: { category: string, color: string }) {
    this.firestore.collection('categories').doc(category.category).set(category)
      .then(() => {
        console.log('Kategorie erfolgreich gespeichert.');
      })
      .catch((error) => {
        console.error('Fehler beim Speichern der Kategorie:', error);
      });
  }
  


  selectContact(contact: any) {
    const assignedTo = this.taskForm.get('profileForm.assignedTo') as FormArray;
    const fullName = `${contact.firstName} ${contact.lastName}`;

    if (assignedTo.controls.some(control => control.value === fullName)) {
      const index = assignedTo.controls.findIndex(control => control.value === fullName);
      assignedTo.removeAt(index);
    } else {
      assignedTo.push(new FormControl(fullName));
    }
  }


  isSelected(contact: any) {
    const assignedTo = this.taskForm.get('profileForm.assignedTo') as FormArray;
    const fullName = `${contact.firstName} ${contact.lastName}`;
    return assignedTo.controls.some(control => control.value === fullName);
  }



  /**
   * Method to stop event propagation.
   * 
   * @param {Event} event - The event to stop. 
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }


  /**
   * Method to toggle the category menu.
   */
  toggleCategoryMenu() {
    this.categoryMenu = !this.categoryMenu;
  }


  /**
   * Method to toggle the assigned to menu.
   */
  toggleAssignedToMenu() {
    this.assignedToMenu = !this.assignedToMenu;
  }


  /**
   * Method to reset the category in the task form.
   */
  resetCategory() {
    this.taskForm.get('categoryForm')?.get('category')?.setValue('');
  }


  membersSelected() {
    this.toggleAssignedToMenu();
    this.feedbackMessageMembers = 'Members selected';
    setTimeout(() => {
      this.feedbackMessageMembers = 'Select your Members';
    }, 2000);
  }


  cancelSelection() {
    const assignedTo = this.taskForm.get('profileForm.assignedTo') as FormArray;
    while (assignedTo.length !== 0) {
      assignedTo.removeAt(0)
    }
    this.toggleAssignedToMenu();
  }


  clickOnCategory(cat: any) {
    const categoryForm = this.taskForm.controls['categoryForm'] as FormGroup;
    categoryForm.controls['category'].setValue(cat.category);
    categoryForm.controls['color'].setValue(cat.color);
    this.selectedCategory = cat; 
    this.categoryMenu = false;
  }
  


addSubtask() {
  const control = new FormControl(null);
  (this.taskForm.get('profileForm.subtasks') as FormArray).push(control);
  this.subtaskInput = true;
}


confirmSubtask(index: number) {
  const subtasks = this.taskForm.get('profileForm.subtasks') as FormArray;
  const confirmedSubtask = subtasks.at(index).value;
  this.createdSubtasks.push(confirmedSubtask);
  subtasks.removeAt(index);
  this.subtaskInput = false;
}


cancelSubtask() {
  (this.taskForm.get('profileForm.subtasks') as FormArray).removeAt((this.taskForm.get('profileForm.subtasks') as FormArray).length - 1);
  this.subtaskInput = false;
}


  removeSubtask(index: number) {
    this.createdSubtasks.splice(index, 1);
  }



  getSubtasks() {
    return (this.taskForm.get('profileForm.subtasks') as FormArray).controls as FormControl[];
  }

  onClear(event: Event) {
    event.stopPropagation();  
    this.resetAllSelections();
  }

  
    /**
   * Resets all selections and forms.
   */
    resetAllSelections() {
      this.taskForm.reset();
      this.feedbackMessageMembers = 'Select your Members';
      this.selectedCategory = null;
      this.categoryMenu = false;
      this.assignedToMenu = false;
      this.createdSubtasks = [];
      this.prioUrgent = false;
      this.prioMedium = false;
      this.prioLow = true;
      this.subtaskInput = false;
    }
}
