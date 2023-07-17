import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data-service';
import { TaskInterface, ContactInterface } from '../modellInterface';
import { Observable, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-card-task',
  templateUrl: './card-task.component.html',
  styleUrls: ['./card-task.component.scss']
})
export class CardTaskComponent implements OnInit {
  taskId: string | null = null;
  task: TaskInterface | null = null;
  assignedContacts$?: Observable<ContactInterface[]>;
  contacts: ContactInterface[] = [];


  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) { }


  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.dataService.getTaskById(this.taskId).subscribe((task: TaskInterface | undefined) => {
        if (task) {
          this.task = task;
          this.assignedContacts$ = this.dataService.getContacts().pipe(
            map((contacts: ContactInterface[]) =>
              contacts.filter(contact => this.task?.assignedTo?.includes(contact.id))
            )
          );
        } else {
          console.log('Task not found');
        }
      });

    }
    this.dataService.getContacts().subscribe((contacts: ContactInterface[]) => {
      this.contacts = contacts;
    });
  }


  getColorForContact(name: string): string {
    const contact = this.contacts.find(contact => `${contact.firstName} ${contact.lastName}` === name);
    return contact ? contact.color : 'defaultColor';
  }


  getInitials(name: string): string {
    let parts = name.split(' ');
    if (parts.length === 2) {
      let initials = parts[0][0] + parts[1][0];
      return initials.toUpperCase();
    } else {
      return name[0].toUpperCase();
    }
  }


  deleteTask(): void {
    if (!this.task || !this.taskId) {
      console.log('Task or Task ID is not defined');
      return;
    }
    this.dataService.deleteTask(this.taskId).subscribe(() => {
      this.router.navigate(['/board']);
    });
  }
  

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  getFullNameForContact(name: string): string {
    const contact = this.contacts.find(contact => `${contact.firstName} ${contact.lastName}` === name);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unnamed';
  }
  

}
