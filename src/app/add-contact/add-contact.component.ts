import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})


/**
 * Form group for the contact form.
 * 
 * @type {FormGroup}
 */
export class AddContactComponent implements OnInit {
  contactForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z-]*$')]],
    lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z-]*$')]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    color: ['#000000']
  });


  /**
   *    Constructs the AddContactComponent.
   * 
     * @param {AngularFirestore} firestore - Firestore instance.
     * @param {Router} router - Router instance.
     * @param {FormBuilder} fb - FormBuilder instance.
   */
  constructor(
    private firestore: AngularFirestore, 
    private router: Router, 
    private fb: FormBuilder) { }


  ngOnInit(): void {
  }


  /**
   * Method to submit the form and create a new contact.
   */
  onSubmit() {
    if (this.contactForm.valid) {
      const newContact = {
        firstName: this.contactForm.get('firstName')?.value ?? '',
        lastName: this.contactForm.get('lastName')?.value ?? '',
        email: this.contactForm.get('email')?.value ?? '',
        phone: this.contactForm.get('phone')?.value ?? '',
        color: this.contactForm.get('color')?.value ?? '',
      };
      this.firestore
        .collection('contacts')
        .add(newContact)
        .then(() => {
          console.log('Kontakt erfolgreich in Firestore gespeichert.');
        })
        .catch((error) => {
          console.error('Fehler beim Speichern des Kontakts:', error);
        });
    }
  }


  /**
   * Method to submit the form and navigate to contacts page.
   */
  onSubmitAndNavigate() {
    if (this.contactForm.valid) {
      this.onSubmit();
      this.router.navigate(['/contacts']);
    } else {
      console.log('Was machst du da????');      
    }
  }


  /**
   * Method to stop event propagation.
   * 
   * @param {Event} event - The event to stop.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
