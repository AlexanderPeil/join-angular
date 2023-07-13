import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContactInterface } from './contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private selectedContactSubject: BehaviorSubject<ContactInterface | null> = new BehaviorSubject<ContactInterface | null>(null);
  selectedContact$ = this.selectedContactSubject.asObservable();

  updatedContact$ = new BehaviorSubject<ContactInterface | null>(null);

  setSelectedContact(contact: ContactInterface | null) {
    this.selectedContactSubject.next(contact);
  }

  setUpdatedContact(contact: ContactInterface | null) {
    this.updatedContact$.next(contact);
  }

  private _refreshNeeded$ = new BehaviorSubject<void>(undefined);
  
  readonly refreshNeeded$ = this._refreshNeeded$.asObservable();

  refreshContacts() {
    this._refreshNeeded$.next();
  }
}


