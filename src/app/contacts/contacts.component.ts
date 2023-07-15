import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { DataService  } from '../data-service';
import { TaskInterface, ContactInterface } from '../modellInterface';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts$: Observable<ContactInterface[]>;
  uniqueLetters: string[] = [];
  selectedContact: ContactInterface | null = null;

  constructor(private firestore: AngularFirestore, private contactService: DataService ) {
    this.contacts$ = this.firestore.collection('contacts').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ContactInterface;
        const id = a.payload.doc.id;
        return { ...data, id };
      }))
    );
    
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
    this.contactService.updatedContact$.subscribe(updatedContact => {
      if (updatedContact && this.selectedContact && this.selectedContact.id === updatedContact.id) {
        this.selectedContact = updatedContact;
      }
    });

    this.contacts$.subscribe((contacts: ContactInterface[]) => {
      const lettersSet = new Set<string>();
      contacts.forEach(contact => {
        lettersSet.add(contact.lastName.charAt(0).toUpperCase());
      });
      this.uniqueLetters = Array.from(lettersSet);
    });
  }
}

