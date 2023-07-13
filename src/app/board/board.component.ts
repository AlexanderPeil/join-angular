import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  tasks!: Observable<any[]>;

  todo: any[] = [];
  in_progress: any[] = [];
  awaiting_feedback: any[] = [];
  done: any[] = [];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.firestore.collection('tasks').valueChanges({ idField: 'id' })
      .subscribe(tasks => {
        this.todo = [];
        this.in_progress = [];
        this.awaiting_feedback = [];
        this.done = [];

        tasks.forEach((task: any) => {
          switch (task.status) {
            case 'todo': this.todo.push(task); break;
            case 'in_progress': this.in_progress.push(task); break;
            case 'awaiting_feedback': this.awaiting_feedback.push(task); break;
            case 'done': this.done.push(task); break;
          }
        });
      });
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
}
