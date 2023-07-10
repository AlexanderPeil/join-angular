import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  color: string;
}


@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})

export class AddContactComponent implements OnInit {
  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    color: new FormControl('')
  });


  constructor(private firestore: AngularFirestore, private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit() {
    const newContact: Contact = {
      firstName: this.profileForm.get('firstName')?.value ?? '',
      lastName: this.profileForm.get('lastName')?.value ?? '',
      email: this.profileForm.get('email')?.value ?? '',
      phone: this.profileForm.get('phone')?.value ?? '',
      color: this.profileForm.get('color')?.value ?? ''
    };

    this.firestore
      .collection('contacts') // Name der Firestore-Sammlung für Kontakte
      .add(newContact)
      .then(() => {
        console.log('Kontakt erfolgreich in Firestore gespeichert.');
        // Hier kannst du weitere Aktionen nach dem Speichern durchführen, z.B. Erfolgsmeldung anzeigen oder Formular zurücksetzen.
      })
      .catch((error) => {
        console.error('Fehler beim Speichern des Kontakts:', error);
        // Hier kannst du Fehlerbehandlung durchführen, z.B. Fehlermeldung anzeigen.
      });
  }

  onSubmitAndNavigate() {
    this.onSubmit();
    this.router.navigate(['/contacts']);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
