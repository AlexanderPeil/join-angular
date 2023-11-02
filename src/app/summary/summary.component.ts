import { Component, HostListener, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AuthService } from "../shared/services/auth.service";
import { DataService } from '../shared/services/data-service';
import { TaskInterface } from '../shared/models/modellInterface';
import { DatePipe } from '@angular/common';


/**
 * @class
 * The SummaryComponent provides the functionality for displaying user's tasks summary and a personalized greeting.
 * @property {string} greeting - The greeting displayed to the user.
 * @property {string} username - Displays the username.
 * @property {TaskInterface[]} tasks - Array of user's tasks.
 * @property {boolean} isMobile - A boolean value indicating if the device is a mobile device.
 * @property {boolean} showMobileGreet - A boolean value to toggle greeting display for mobile devices.
 * @property {TaskInterface[]} urgentTasks - Array of user's urgent tasks.
 * @property {Date | undefined} nearestUrgentTaskDate - The nearest urgent task date if available.
 */
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
  urgentTasks: TaskInterface[] = [];
  nearestUrgentTaskDate: Date | undefined;


  /**
   * @param {AuthService} authService - An instance of AuthService for authentication services.
   * @param {DataService} dataService - An instance of DataService for managing data.
   * @param {string} locale - The locale id injected from Angular's LOCALE_ID token.
   */
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    @Inject(LOCALE_ID) private locale: string) { }


  /**
   * Initializes the component and sets up initial values.
   * It checks the window width, sets the greeting and username, and determines if the user is on a mobile device
   * to show a mobile greet container for a few seconds. Retrieves tasks data from the dataService and calculates
   * the nearest urgent task date.
   */
  ngOnInit(): void {
    this.checkWindowWidth();
    this.setUsername();
    this.setGreeting();

    if (this.isMobile) {
      this.showMobileGreet = true;
      setTimeout(() => this.showMobileGreet = false, 3000);
    }
    this.dataService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.urgentTasks = this.tasks.filter(task => task.prio === 'urgent');
      this.nearestUrgentTaskDate = this.calculateNearestUrgentTaskDate();
    });
  }


  /**
   * Calculates and returns the nearest urgent task date based on the urgent tasks' due dates.
   * If no urgent tasks exist, it returns `undefined`.
   * @returns The nearest urgent task date or `undefined` if no urgent tasks are present. 
   */
  calculateNearestUrgentTaskDate(): Date | undefined {
    const urgentDates: Date[] = this.urgentTasks.map(task => new Date(task.date));
    if (urgentDates.length > 0) {
      const nearestTimestamp: number = Math.min(...urgentDates.map(date => date.getTime()));
      return new Date(nearestTimestamp);
    }
    return undefined;
  }


  /**
   * Formats the nearest urgent task date in the format 'MMMM d, y' (e.g., 'July 22, 2023').
   * f the nearest urgent task date is not available, it returns `undefined`.
   * @returns The formatted nearest urgent task date or `undefined` if the date is not available.
   */
  formatNearestUrgentTaskDate(): string | undefined {
    if (this.nearestUrgentTaskDate) {
      const datePipe = new DatePipe(this.locale);
      return datePipe.transform(this.nearestUrgentTaskDate, 'MMMM d, y')!;
    }
    return undefined;
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
   * Gets the number of tasks todo.
   * @returns The number of tasks todo.
   */
  getTasksTodo(): number {
    return this.tasks.filter(task => task.status === 'todo').length;
  }


  /**
   * Gets the number of tasks done.
   * @returns The number of tasks done.
   */
  getTasksDone(): number {
    return this.tasks.filter(task => task.status === 'done').length;
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