import { Component, OnInit } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Contact {
  id: string;
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
  uniqueLetters: string[] = [];
  selectedContact: Contact | null = null;

  constructor(private firestore: AngularFirestore) {
    this.contacts$ = this.firestore.collection<Contact>('contacts').valueChanges({ idField: 'id' });
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact;
  }

  deleteContact(contact: Contact) {
    this.firestore.collection('contacts').doc(contact.id).delete().then(() => {
      console.log('Kontakt erfolgreich gelöscht.');
      this.selectedContact = null;
    }).catch((error) => {
      console.error('Fehler beim Löschen des Kontakts:', error);
    });
  }

  ngOnInit(): void {
    this.contacts$.subscribe(contacts => {
      const lettersSet = new Set<string>();
      contacts.forEach(contact => {
        lettersSet.add(contact.lastName.charAt(0).toUpperCase());
      });
      this.uniqueLetters = Array.from(lettersSet);
    });
  }
}
