import { Component, HostListener, OnInit } from '@angular/core';
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
  isMobile: boolean = false;
  showMobileGreet = false;

  constructor(private authService: AuthService, private dataService: DataService) { }


/**
 * Initializes the component and sets up initial values.
 * It checks the window width and sets the greeting and username.
 * If it's in mobile view, it displays a mobile greet container for a few seconds.
 * Retrieves tasks data from the dataService.
 */
  ngOnInit(): void {
    this.checkWindowWidth();
    this.setUsername();
    this.setGreeting();

    if (this.isMobile) {
      this.showMobileGreet = true;
      setTimeout(() => {
        this.showMobileGreet = false;
      }, 3000);
    }

    this.dataService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }


/**
 * Event listener for window resize events.
 * Triggers the checkWindowWidth function when the window is resized.
 *
 * @param event - The window resize event object.
 */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowWidth();
  }


/**
 * Checks the window width and sets the isMobile property accordingly.
 * If the window width is less than 1000 pixels, it sets isMobile to true, otherwise false.
 */
  private checkWindowWidth() {
    this.isMobile = window.innerWidth < 1000;
  }


  /**
   * Gets the total number of tasks.
   * @returns The total number of tasks.
   */
  getTotalTasks(): number {
    return this.tasks.length;
  }


  /**
   * Gets the number of tasks in progress.
   * @returns The number of tasks in progress.
   */
  getTasksInProgress(): number {
    return this.tasks.filter(task => task.status === 'in_progress').length;
  }


  /**
   * Gets the number of tasks awaiting feedback.
   * @returns The number of tasks awaiting feedback.
   */
  getTasksAwaitingFeedback(): number {
    return this.tasks.filter(task => task.status === 'awaiting_feedback').length;
  }


  /**
   * Sets the username property to the user's display name.
   * If the user is not logged in, it sets the username to 'Guest'.
   */
  setUsername() {
    const user = this.authService.userData;
    this.username = user?.displayName || 'Guest';
  }


/**
 * Sets the greeting property based on the current hour of the day.
 * If the hour is before 12 PM, it sets the greeting to 'Good morning'.
 * If the hour is between 12 PM and 5 PM, it sets the greeting to 'Good afternoon'.
 * Otherwise, it sets the greeting to 'Good evening'.
 */
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