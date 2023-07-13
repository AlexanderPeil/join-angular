import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ContactService } from '../contact-service.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts$: Observable<any[]>;
  uniqueLetters: string[] = [];
  selectedContact: any | null = null;

  constructor(private firestore: AngularFirestore, private contactService: ContactService) {
    this.contacts$ = this.firestore.collection('contacts').valueChanges({ idField: 'id' });
  }

  selectContact(contact: any) {
    this.contactService.setSelectedContact(contact);
  }

  editContact(selectedContact: any) {
  }

  deleteContact(contact: any) {
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
    this.contactService.updatedContact$.subscribe(updatedContact => {
      if (updatedContact && this.selectedContact && this.selectedContact.id === updatedContact.id) {
        this.selectedContact = updatedContact;
      }
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

