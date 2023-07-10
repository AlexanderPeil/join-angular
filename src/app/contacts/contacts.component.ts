import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  color: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts$: Observable<Contact[]>;

  constructor(private firestore: AngularFirestore) {
    this.contacts$ = this.firestore.collection<Contact>('contacts').valueChanges();
  }

  ngOnInit(): void {

  }

}

