import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  tasks!: Observable<any[]>;
  contacts: any[] = [];
  editingTask: any = null;

  todo: any[] = [];
  in_progress: any[] = [];
  awaiting_feedback: any[] = [];
  done: any[] = [];

  mousedownTime: number | undefined;


  constructor(private firestore: AngularFirestore, private router: Router) { }

  ngOnInit() {
    this.firestore.collection('tasks').valueChanges({ idField: 'id' })
      .subscribe(tasks => {
        this.todo = [];
        this.in_progress = [];
        this.awaiting_feedback = [];
        this.done = [];

        tasks.forEach((task: any) => {
          if (typeof task.assignedTo === 'string') {
            task.assignedTo = [task.assignedTo];
          }
          switch (task.status) {
            case 'todo': this.todo.push(task); break;
            case 'in_progress': this.in_progress.push(task); break;
            case 'awaiting_feedback': this.awaiting_feedback.push(task); break;
            case 'done': this.done.push(task); break;
          }
        });
      });

    this.firestore.collection('contacts').valueChanges().subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  getColorForContact(name: string): string {
    const contact = this.contacts.find(contact => `${contact.firstName} ${contact.lastName}` === name);
    return contact ? contact.color : 'defaultColor';  
  }

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

  getStatusFromContainerId(containerId: string): 'todo' | 'in_progress' | 'awaiting_feedback' | 'done' {
    switch (containerId) {
      case 'todoList': return 'todo';
      case 'inProgressList': return 'in_progress';
      case 'awaitingFeedbackList': return 'awaiting_feedback';
      case 'doneList': return 'done';
      default: throw new Error(`Unbekannter Container: ${containerId}`);
    }
  }

  getPriorityImage(prio: string) {
    switch (prio) {
      case 'urgent': return '../../assets/img/prio_urgent_logo.png';
      case 'medium': return './../assets/img/prio_medium_logo.png';
      case 'low': return './../assets/img/prio_low_logo.png';
      default: return 'assets/img/default_logo.png';
    }
  }

  onMousedown(event: MouseEvent) {
    if (event.button === 0) {
      this.mousedownTime = event.timeStamp;
    }
  }

  onMouseup(event: MouseEvent, taskId: string) {
    if (event.button === 0) {
      const elapsed = event.timeStamp - (this.mousedownTime ?? 0);
      if (elapsed < 200) {
        this.navigateToEditTask(taskId);
      }
      this.mousedownTime = undefined;
    }
  }

  navigateToEditTask(taskId: string) {
    this.router.navigate(['/edit-task', taskId]);
  }


  getInitials(name: string): string {
    let parts = name.split(' ');
    let initials = parts[0][0] + parts[1][0];
    return initials.toUpperCase();
  }

}
