import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { TaskInterface } from '../shared/models/modellInterface';
import { DataService } from '../shared/services/data-service';
import { Router } from '@angular/router';


/**
 * @class
 * AddTaskComponent allows users to add new tasks to the application.
 * @property {boolean} subtaskInput - Flag indicating whether subtask input field should be displayed.
 * @property {Observable<any[]>} contacts$ - An Observable stream of contacts data.
 * @property {Observable<any[]>} categories$ - An Observable stream of categories data.
 * @property {any} selectedCategory - The currently selected category.
 * @property {boolean} taskAdded - Flag indicating whether a task was added.
 * @property {boolean} taskCreationError - Flag indicating whether a task could not be added.
 * @property {boolean} prioUrgent - Flag indicating whether the urgent priority is selected.
 * @property {boolean} prioMedium - Flag indicating whether the medium priority is selected.
 * @property {boolean} prioLow - Flag indicating whether the low priority is selected.
 * @property {string} minDate - The minimum date that can be selected.
 * @property {boolean} categoryMenu - Flag indicating whether the category menu should be displayed.
 * @property {boolean} assignedToMenu - Flag indicating whether the assigned to menu should be displayed.
 * @property {string} feedbackMessageMembers - The feedback message to be displayed for member selection.
 * @property {string[]} createdSubtasks - An array of created subtasks.
 * @property {QueryList<ElementRef>} subtaskInputs - QueryList of subtask input fields.
 */
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})


export class AddTaskComponent {
  subtaskInput: boolean = false;
  contacts$: Observable<any[]>;
  categories$: Observable<any[]>;
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


  /**
   * Represents the task form that collects all task-related information.
   * The form is divided into two sub-forms, the profileForm and categoryForm.
   *  @property {FormGroup} profileForm - Group that encapsulates task profile related fields.
   *  @property {FormControl} title - The title of the task.
   *  @property {FormControl} description - The description of the task.
   *  @property {FormArray} assignedTo - An array that holds the users assigned to the task.
   *  @property {FormControl} date - The due date of the task.
   *  @property {FormControl} prio - The priority level of the task. Defaults to 'low'.
   *  @property {FormArray} subtasks - An array that holds the subtasks of the task.
   *  @property {FormGroup} categoryForm - Group that encapsulates task category related fields.
   *  @property {FormControl} category - The category of the task.
   *  @property {FormControl} color - The color associated with the category. Defaults to '#ff0000'.
   */
  taskForm = new FormGroup({
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
    const newTask: TaskInterface = {
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
    } catch (error) {
      return;
    }
    this.taskForm.controls.categoryForm.reset({ color: '#ff0000' });
  }


  /**
   * Submits the form and navigates to the board view if the form is valid.
   * If the task creation fails or the form is invalid, it sets `taskCreationError` to true.
   */
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


  /**
   * Selects a category and sets its value and color in the categoryForm.
   * @param {any} cat - The category to be selected. 
   */
  selectCategory(cat: any) {
    const categoryForm = this.taskForm.controls['categoryForm'] as FormGroup;
    categoryForm.controls['category'].setValue(cat.category);
    categoryForm.controls['color'].setValue(cat.color);
    this.selectedCategory = cat;
    this.categoryMenu = false;
  }



  /**
   * Adds a category to Firestore.
   * @param {string} category - The category name. 
   * @param {string} color - The color associated with the category. 
   */
  async addCategory(category: string, color: string) {
    try {
      await this.dataService.addCategoryFromService(category, color);
      console.log('Kategorie erfolgreich in Firestore gespeichert.');
    } catch (error) {
      console.error('Fehler beim Speichern der Kategorie:', error);
    }
  }


  /**
   * Checks if a category and color are selected and saves the category.
   */
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


  /**
   * Saves a category to Firestore.
   * @param {{ category: string, color: string }} category - The category to be saved. 
   */
  saveCategory(category: { category: string, color: string }) {
    this.firestore.collection('categories').doc(category.category).set(category)
      .then(() => {
        console.log('Kategorie erfolgreich gespeichert.');
      })
      .catch((error) => {
        console.error('Fehler beim Speichern der Kategorie:', error);
      });
  }


  /**
   * Selects or deselects a contact. If the contact is already selected, it will be deselected.
   * @param {any} contact - The contact to be selected or deselected. 
   */
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


  /**
   * Checks if a contact is selected.
   * @param {any} contact - The contact to be selected or deselected. 
   */
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


  /**
   * Handles the selection of members. It changes the feedback message and reverts it after a delay.
   */
  membersSelected() {
    this.toggleAssignedToMenu();
    this.feedbackMessageMembers = 'Members selected';
    setTimeout(() => {
      this.feedbackMessageMembers = 'Select your Members';
    }, 2000);
  }


  /**
   * Cancels the member selection by clearing all selected members and toggling the member selection menu.
   */
  cancelSelection() {
    const assignedTo = this.taskForm.get('profileForm.assignedTo') as FormArray;
    while (assignedTo.length !== 0) {
      assignedTo.removeAt(0)
    }
    this.toggleAssignedToMenu();
  }


  /**
   * Handles the selection of a category. Sets the selected category and its color in the categoryForm.
   * @param {any} cat - The category to be selected. 
   */
  clickOnCategory(cat: any) {
    const categoryForm = this.taskForm.controls['categoryForm'] as FormGroup;
    categoryForm.controls['category'].setValue(cat.category);
    categoryForm.controls['color'].setValue(cat.color);
    this.selectedCategory = cat;
    this.categoryMenu = false;
  }


  /**
   * Adds a new control for a subtask to the subtasks FormArray. Focuses on the input field of the newly added subtask.
   */
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


  /**
   * Confirms the subtask at the specified index by adding it to the createdSubtasks array and removing it from the FormArray.
   * @param {number} index - The index of the subtask to be confirmed. 
   */
  confirmSubtask(index: number) {
    const subtasks = this.taskForm.get('profileForm.subtasks') as FormArray;
    const confirmedSubtask = subtasks.at(index).value;
    this.createdSubtasks.push(confirmedSubtask);
    subtasks.removeAt(index);
    this.subtaskInput = false;
  }


  /**
   * Cancels the last added subtask by removing it from the subtasks FormArray.
   */
  cancelSubtask() {
    (this.taskForm.get('profileForm.subtasks') as FormArray).removeAt((this.taskForm.get('profileForm.subtasks') as FormArray).length - 1);
    this.subtaskInput = false;
  }


  /**
   * Removes a subtask from the createdSubtasks array.
   * @param {number} index - The index of the subtask to be removed. 
   */
  removeSubtask(index: number) {
    this.createdSubtasks.splice(index, 1);
  }


  /**
   * Gets the controls of the subtasks FormArray as FormControl instances.
   * @returns {FormControl[]} - An array of FormControl instances.
   */
  getSubtasks() {
    return (this.taskForm.get('profileForm.subtasks') as FormArray).controls as FormControl[];
  }


  /**
   * Clears all selections when an outside click is detected.
   * @param {Event} event - The DOM event triggered. 
   */
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
