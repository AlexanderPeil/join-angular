import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContactInterface } from './contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private selectedContactSubject: BehaviorSubject<ContactInterface | null> = new BehaviorSubject<ContactInterface | null>(null);
  selectedContact$ = this.selectedContactSubject.asObservable();

  setSelectedContact(contact: ContactInterface | null) {
    this.selectedContactSubject.next(contact);
  }
}

