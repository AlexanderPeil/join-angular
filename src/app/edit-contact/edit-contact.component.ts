import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ContactInterface } from '../contact';
import { ContactService } from '../contact-service.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements OnInit {
  editForm: FormGroup;
  selectedContact: ContactInterface | null = null;

  constructor(private contactService: ContactService, private router: Router, private firestore: AngularFirestore) {
    this.editForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.contactService.selectedContact$.subscribe(contact => {
      this.selectedContact = contact;

      if (this.selectedContact) {
        this.editForm.patchValue({
          firstName: this.selectedContact.firstName,
          lastName: this.selectedContact.lastName,
          email: this.selectedContact.email,
          phone: this.selectedContact.phone,
        });
      }
    });
  }

  onSaveChanges(): void {
    if (this.selectedContact) {
      const updatedContact = {
        id: this.selectedContact.id,
        firstName: this.editForm.value.firstName,
        lastName: this.editForm.value.lastName,
        email: this.editForm.value.email,
        phone: this.editForm.value.phone,
      };

      this.firestore.collection('contacts').doc(updatedContact.id).update(updatedContact)
        .then(() => {
          console.log('Kontakt erfolgreich aktualisiert.');
          this.router.navigate(['/contacts']);
        })
        .catch((error) => {
          console.error('Fehler beim Aktualisieren des Kontakts:', error);
        });
    }
  }

  onSubmitAndNavigate() {
    this.onSaveChanges();
    this.router.navigate(['/contacts']);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
