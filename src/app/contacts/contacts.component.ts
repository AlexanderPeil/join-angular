import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ContactInterface } from '../contact';
import { ContactService } from '../contact-service.service';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts$: Observable<ContactInterface[]>;
  uniqueLetters: string[] = [];
  selectedContact: ContactInterface | null = null;

  constructor(private firestore: AngularFirestore, private contactService: ContactService) {
    this.contacts$ = this.firestore.collection<ContactInterface>('contacts').valueChanges({ idField: 'id' });
  }

  selectContact(contact: ContactInterface) {
  this.contactService.setSelectedContact(contact);
  }

  editContact(selectedContact: ContactInterface) {
  }

  deleteContact(contact: ContactInterface) {
    this.firestore.collection('contacts').doc(contact.id).delete().then(() => {
      console.log('Kontakt erfolgreich gelöscht.');
      this.selectedContact = null;
    }).catch((error) => {
      console.error('Fehler beim Löschen des Kontakts:', error);
    });
  }

  ngOnInit(): void {
    this.contactService.selectedContact$.subscribe(contact => {
      this.selectedContact = contact;
    });

    this.contacts$.subscribe(contacts => {
      const lettersSet = new Set<string>();
      contacts.forEach(contact => {
        lettersSet.add(contact.lastName.charAt(0).toUpperCase());
      });
      this.uniqueLetters = Array.from(lettersSet);
    });
  } 
}

