import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/services/data-service';
import { Observable } from 'rxjs';
import { TaskInterface } from '../shared/models/modellInterface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})


export class EditTaskComponent implements OnInit {
  subtaskInput: boolean = false;
  contacts$: Observable<any[]> | undefined;
  categories$: Observable<any[]> | undefined;
  selectedCategory: any;


  prioUrgent: boolean = false;
  prioMedium: boolean = false;
  prioLow: boolean = false;

  minDate: string;
  categoryMenu = false;
  assignedToMenu = false;

  feedbackMessageMembers = 'Select your Members';
  createdSubtasks: string[] = [];
  currentTask: TaskInterface | null = null;
  @ViewChildren('subtaskInput') subtaskInputs!: QueryList<ElementRef>;


  constructor(
    private location: Location,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router) {
    this.minDate = new Date().toISOString().split('T')[0];
    this.contacts$ = this.dataService.getContacts();
    this.categories$ = this.dataService.getCategories();
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const taskId = params['id'];
      this.dataService.getTaskById(taskId).subscribe(task => {
        this.currentTask = task ?? null;
        this.selectedCategory = { category: task?.category, color: task?.color };

        const assignedToFormArray = new FormArray(task?.assignedTo?.map(item => new FormControl(item)) || []);
        const subtasksFormArray = new FormArray(task?.subtasks?.map(item => new FormControl(item)) || []);
        if (this.currentTask?.subtasks) {
          this.createdSubtasks = [...this.currentTask.subtasks];
        }
        const profileForm = this.taskForm.get('profileForm') as FormGroup;
        profileForm.setControl('assignedTo', assignedToFormArray);
        profileForm.setControl('subtasks', subtasksFormArray);

        this.taskForm.patchValue({
          profileForm: {
            title: task?.title ?? null,
            description: task?.description ?? null,
            date: task?.date ?? null,
            prio: task?.prio ?? null,
          },
          categoryForm: {
            category: task?.category ?? null,
            color: task?.color ?? null
          }
        });
        this.prioUrgent = task?.prio === 'urgent';
        this.prioMedium = task?.prio === 'medium';
        this.prioLow = task?.prio === 'low';
      });
    });
    console.log(this.createdSubtasks);
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
      assignedTo: new FormArray([]),
      date: new FormControl(''),
      prio: new FormControl(''),
      subtasks: new FormArray([]),
    }),
    categoryForm: new FormGroup({
      category: new FormControl(''),
      color: new FormControl('')
    })
  });


  onSubmit() {
    const profileForm = this.taskForm.controls['profileForm'] as FormGroup;
    const categoryForm = this.taskForm.controls['categoryForm'] as FormGroup;

    const assignedToFormArray = profileForm.controls['assignedTo'] as FormArray;

    const assignedToArray = assignedToFormArray.controls.map(control => control.value);

    const newTask = {
      title: profileForm.controls['title'].value ?? '',
      description: profileForm.controls['description'].value ?? '',
      assignedTo: assignedToArray,
      date: profileForm.controls['date'].value ?? '',
      prio: profileForm.controls['prio'].value ?? '',
      subtasks: this.createdSubtasks,
      category: categoryForm.controls['category'].value ?? '',
      color: categoryForm.controls['color'].value ?? '',
      status: (this.currentTask?.status as 'todo' | 'in_progress' | 'awaiting_feedback' | 'done') ?? 'todo',
    };

    if (this.currentTask && this.currentTask.id) {
      return this.dataService.updateTask(this.currentTask.id, newTask)
        .then(() => {
          console.log('Aufgabe erfolgreich in Firestore aktualisiert.');
          this.taskForm.controls.categoryForm.reset({ color: '#ff0000' });
        })
        .catch((error) => {
          console.error('Fehler beim Aktualisieren der Aufgabe:', error);
          throw error;
        });
    } else {
      console.error('Fehler: currentTask oder currentTask.id ist null.');
      throw new Error('Fehler: currentTask oder currentTask.id ist null.');
    }
    this.taskForm.controls.categoryForm.reset({ color: '#ff0000' });
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


  confirmSubtask(value: string) {
    this.createdSubtasks.push(value);
    this.subtaskInput = false;
  }



  cancelSubtask() {
    (this.taskForm.get('profileForm.subtasks') as FormArray).removeAt((this.taskForm.get('profileForm.subtasks') as FormArray).length - 1);
    this.subtaskInput = false;
  }


  removeSubtask(index: number) {
    this.createdSubtasks.splice(index, 1);
  }


  membersSelected() {
    this.toggleAssignedToMenu();
    this.feedbackMessageMembers = 'Members selected';
    setTimeout(() => {
      this.feedbackMessageMembers = 'Select your Members';
    }, 2000);
  }


  getSubtasks() {
    return (this.taskForm.get('profileForm.subtasks') as FormArray).controls as FormControl[];
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


  async onSubmitAndNavigate() {
    if (this.taskForm.valid) {
      try {
        await this.onSubmit();
        this.router.navigate(['/board']);
      } catch (error) {
        console.error('Fehler beim Speichern der Aufgabe:', error);
      }
    } else {
      console.log('Was machst du da????');
    }
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
