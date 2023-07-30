import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskInterface } from '../modellInterface';


/**
 * @class
 * BoardComponent provides an interface for handling and displaying tasks.
 * @implements {OnInit}
 * @property {TaskInterface | null} selectedTask - The task currently selected, null if no task is selected.
 * @property {TaskInterface | undefined} task - An @Input property that gets the task from a parent component.
 * @property {EventEmitter<void>} close - An @Output EventEmitter that is triggered when the menu needs to be closed.
 * @property {Observable<any[]>} tasks - An Observable array of tasks.
 * @property {any[]} contacts - An array of contacts.
 * @property {any | null} editingTask - The task currently being edited, null if no task is being edited.
 * @property {any[]} todo - An array of tasks that are yet to be started.
 * @property {any[]} in_progress - An array of tasks that are currently in progress.
 * @property {any[]} awaiting_feedback - An array of tasks that are awaiting feedback.
 * @property {any[]} done - An array of tasks that are completed.
 * @property {number | undefined} mousedownTime - The time when the mouse button was pressed.
 * @property {string} searchTerm - The term to search the tasks.
 * @property {any[]} filteredTodoTasks - The list of tasks that match the search term in the "todo" state.
 * @property {any[]} filteredInProgressTasks - The list of tasks that match the search term in the "in_progress" state.
 * @property {any[]} filteredAwaitingFeedbacktasks - The list of tasks that match the search term in the "awaiting_feedback" state.
 * @property {any[]} filteredDoneTasks - The list of tasks that match the search term in the "done" state.
 * @function closeMenu - Emits the close event to signal that the menu needs to be closed.
 */
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  selectedTask: TaskInterface | null = null;
  @Input() task: TaskInterface | undefined;
  @Output() close = new EventEmitter<void>();
  tasks!: Observable<any[]>;
  contacts: any[] = [];
  editingTask: any = null;
  todo: any[] = [];
  in_progress: any[] = [];
  awaiting_feedback: any[] = [];
  done: any[] = [];
  mousedownTime: number | undefined;
  searchTerm: string = '';
  filteredTodoTasks!: any[];
  filteredInProgressTasks!: any[];
  filteredAwaitingFeedbacktasks!: any[];
  filteredDoneTasks!: any[];


  /**
   * Constructs a new instance of the BoardComponent.
   * @param {AngularFirestore} firestore - An instance of AngularFirestore for interacting with the Firestore database.
   * @param {Router} router - An instance of Router for navigation.
   * @param {ActivatedRoute} route - An instance of ActivatedRoute for working with the active route.
   */
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute) { }


  /**
   * OnInit lifecycle hook for BoardComponent. Sorts tasks into groups based on their status, 
   * sets up a subscription to contacts from Firestore, and retrieves a task id from the route parameters.
   */
  ngOnInit() {
    this.firestore.collection('tasks').valueChanges({ idField: 'id' })
      .subscribe(tasks => {
        const taskGroups = this.sortTasks(tasks);
        this.filteredTodoTasks = this.todo = taskGroups['todo'];
        this.filteredInProgressTasks = this.in_progress = taskGroups['in_progress'];
        this.filteredAwaitingFeedbacktasks = this.awaiting_feedback = taskGroups['awaiting_feedback'];
        this.filteredDoneTasks = this.done = taskGroups['done'];
      });
    this.firestore.collection('contacts').valueChanges().subscribe(contacts => {
      this.contacts = contacts;
    });
    const taskId = this.route.snapshot.paramMap.get('id');
  }


  /**
   * Sorts an array of tasks into groups based on their status.
   * @param {any[]} tasks - An array of tasks to be sorted.
   * @returns {object} An object containing arrays of tasks grouped by status.
   */
  sortTasks(tasks: any[]) {
    const taskGroups: { [key: string]: any[] } = {
      todo: [],
      in_progress: [],
      awaiting_feedback: [],
      done: [],
    };
    for (const task of tasks) {
      if (typeof task.assignedTo === 'string') {
        task.assignedTo = [task.assignedTo];
      }
      taskGroups[task.status as keyof typeof taskGroups].push(task);
    }
    return taskGroups;
  }


  /**
   * Handles the dropping of a draggable item. If the item was dropped in the same container it was dragged from, 
   * it moves the item within the array. Otherwise, it transfers the item to the new container, 
   * updates the task's status to match the new container, and updates the task in Firestore.
   * @param {CdkDragDrop<any[]>} event - The drop event.
   */
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const movedTask = event.container.data[event.currentIndex];
      const newStatus = this.getStatusFromContainerId(event.container.id);
      movedTask.status = newStatus;
      this.firestore.collection('tasks').doc(movedTask.id).update({ status: newStatus });
    }
  }


  /**
   * Gets the status corresponding to a container id.
   * @param {string} containerId - The id of the container.
   * @returns {'todo' | 'in_progress' | 'awaiting_feedback' | 'done'} The corresponding status.
   */
  getStatusFromContainerId(containerId: string): 'todo' | 'in_progress' | 'awaiting_feedback' | 'done' {
    switch (containerId) {
      case 'todoList': return 'todo';
      case 'inProgressList': return 'in_progress';
      case 'awaitingFeedbackList': return 'awaiting_feedback';
      case 'doneList': return 'done';
      default: throw new Error(`Unbekannter Container: ${containerId}`);
    }
  }


  /**
   * Handles the mousedown event. If the left mouse button is clicked, it records the time of the click.
   * @param {MouseEvent} event - The mousedown event.
   */
  getPriorityImage(prio: string) {
    switch (prio) {
      case 'urgent': return '../../assets/img/prio_urgent_logo.png';
      case 'medium': return './../assets/img/prio_medium_logo.png';
      case 'low': return './../assets/img/prio_low_logo.png';
      default: return 'assets/img/default_logo.png';
    }
  }



  /**
   * Handles the mousedown event. If the left mouse button is clicked, it records the time of the click.
   * @param {MouseEvent} event - The mousedown event.
   */
  onMousedown(event: MouseEvent) {
    if (event.button === 0) {
      this.mousedownTime = event.timeStamp;
    }
  }


  /**
   * Handles the mouseup event. If the left mouse button is released and less than 200 milliseconds 
   * have passed since it was clicked, it navigates to the edit page for the task.
   * @param {MouseEvent} event - The mouseup event.
   * @param {string} taskId - The id of the task.
   */
  onMouseup(event: MouseEvent, taskId: string) {
    if (event.button === 0) {
      const elapsed = event.timeStamp - (this.mousedownTime ?? 0);
      if (elapsed < 200) {
        this.navigateToEditTask(taskId);
      }
      this.mousedownTime = undefined;
    }
  }


  /**
   * Navigates to the edit page for the task with the given id.
   * @param {string} taskId - The id of the task.
   */
  navigateToEditTask(taskId: string) {
    this.router.navigate(['/card-task', taskId]);
  }


  /**
   * Gets the color associated with a contact.
   * @param {string} name - The name of the contact. 
   * @returns {string} The color associated with the contact, or 'defaultColor' if the contact is not found.
   */
  getColorForContact(name: string): string {
    const contact = this.contacts.find(contact => `${contact.firstName} ${contact.lastName}` === name);
    return contact ? contact.color : 'defaultColor';
  }


  /**
   *  Gets the initials of a name.
   * @param {string} name - The name. 
   * @returns {string} The initials of the name.
   */
  getInitials(name: string): string {
    let parts = name.trim().split(' ');
    if (parts.length === 2) {
      let initials = parts[0][0] + parts[1][0];
      return initials.toUpperCase();
    } else {
      if (name.length > 1) {
        return name.substring(0, 2).toUpperCase();
      } else {
        return name[0].toUpperCase();
      }
    }
  }


  /**
   * Filters the tasks based on the search term. If the search term is empty, it resets the filtered tasks to the original tasks.
   */
  filterTasks() {
    if (!this.searchTerm) {
      this.filteredTodoTasks = this.todo;
      this.filteredInProgressTasks = this.in_progress;
      this.filteredAwaitingFeedbacktasks = this.awaiting_feedback;
      this.filteredDoneTasks = this.done;
    } else {
      this.filteredTodoTasks = this.filterTasksBySearchTerm(this.todo);
      this.filteredInProgressTasks = this.filterTasksBySearchTerm(this.in_progress);
      this.filteredAwaitingFeedbacktasks = this.filterTasksBySearchTerm(this.awaiting_feedback);
      this.filteredDoneTasks = this.filterTasksBySearchTerm(this.done);
    }
  }


  /**
   * Filters an array of tasks by the search term.
   * @param {TaskInterface[]} tasks - The tasks to filter. 
   * @returns {TaskInterface[]} The tasks that match the search term.
   */
  filterTasksBySearchTerm(tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter(task =>
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  /**
   * Emits a close event to close the menu.
   */
  closeMenu(): void {
    this.close.emit();
  }
}
