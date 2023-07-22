import { Component, OnInit } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { DataService } from '../data-service';
import { TaskInterface } from '../modellInterface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  greeting = '';
  username = '';
  tasks: TaskInterface[] = [];

  constructor(private authService: AuthService, private dataService: DataService) { }


  ngOnInit(): void {
    this.setUsername();
    this.setGreeting();

    this.dataService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }


  getTotalTasks(): number {
    return this.tasks.length;
  }
  


  getTasksInProgress(): number {
    return this.tasks.filter(task => task.status === 'in_progress').length;
  }


  getTasksAwaitingFeedback(): number {
    return this.tasks.filter(task => task.status === 'awaiting_feedback').length;
  }  

  
  setUsername() {
    const user = this.authService.userData;
    this.username = user?.displayName || 'Guest';
  }


  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good morning';
    } else if (hour < 17) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

}