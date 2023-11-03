import { Component, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { Task } from '../models/task-model';
import { TaskService } from '../shared/services/task.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})


export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;
  subtaskInput: boolean = false;
  selectedCategory: any;
  taskAdded: boolean = false;
  taskCreationError: boolean = false;
  prioUrgent: boolean = false;
  prioMedium: boolean = false;
  prioLow: boolean = true;
  minDate: string;
  categoryMenu = false;
  assignedToMenu = false;
  feedbackMessageMembers = 'Select your Members';
  createdSubtasks: string[] = [];
  @ViewChildren('subtaskInput') subtaskInputs!: QueryList<ElementRef>;
  loading: boolean = false;


  constructor(
    private taskService: TaskService,
    private router: Router) {
    this.minDate = new Date().toISOString().split('T')[0];
  }


  ngOnInit() {
    this.initializeForm();
  }


  setPriority(priority: string) {
    this.prioUrgent = priority === 'urgent';
    this.prioMedium = priority === 'medium';
    this.prioLow = priority === 'low';

    const profileForm = this.taskForm.controls['profileForm'] as FormGroup;
    profileForm.controls['prio'].setValue(priority);
  }


  initializeForm() {
    this.taskForm = new FormGroup({
      profileForm: new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        assignedTo: new FormArray([]),
        date: new FormControl('', Validators.required),
        prio: new FormControl('low'),
        subtasks: new FormArray([])
      }),
      categoryForm: new FormGroup({
        category: new FormControl('', Validators.required),
        color: new FormControl('#ff0000', Validators.required)
      })
    });
  }


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
    const newTask: Task = {
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
      await this.taskService.addTask(newTask);
    } catch (error) {
      return;
    }
    this.taskForm.controls['categoryForm'].reset({ color: '#ff0000' });
  }


  onSubmitAndNavigate() {
    if (this.taskForm.valid) {
      this.onSubmit();
      this.taskAdded = true;
      setTimeout(() => {
        this.router.navigate(['/board']);
      }, 2000);
    } else {
      this.taskCreationError = true;
    }
  }


  arrayNotEmpty(control: AbstractControl): ValidationErrors | null {
    const array = control as FormArray;
    return array.controls.length > 0 ? null : { emptyArray: true };
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
      await this.taskService.addCategoryFromService(category, color);
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
    this.taskService.collection('categories').doc(category.category).set(category)
      .then(() => {
        console.log('Kategorie erfolgreich gespeichert.');
      })
      .catch((err: any) => {
        console.error('Fehler beim Speichern der Kategorie:', err);
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



  stopPropagation(event: Event) {
    event.stopPropagation();
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

    setTimeout(() => {
      const lastInput = this.subtaskInputs.last;
      if (lastInput) {
        lastInput.nativeElement.focus();
      }
    });
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
