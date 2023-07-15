import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContactInterface, TaskInterface  } from './modellInterface';

@Injectable({
  providedIn: 'root'
})
export class DataService  {
  private selectedContactSubject: BehaviorSubject<ContactInterface  | null> = new BehaviorSubject<ContactInterface  | null>(null);
  selectedContact$ = this.selectedContactSubject.asObservable();

  updatedContact$ = new BehaviorSubject<ContactInterface  | null>(null);

  setSelectedContact(contact: ContactInterface  | null) {
    this.selectedContactSubject.next(contact);
  }

  setUpdatedContact(contact: ContactInterface  | null) {
    this.updatedContact$.next(contact);
  }

  private _refreshNeeded$ = new BehaviorSubject<void>(undefined);
  
  readonly refreshNeeded$ = this._refreshNeeded$.asObservable();

  refreshContacts() {
    this._refreshNeeded$.next();
  }
}


