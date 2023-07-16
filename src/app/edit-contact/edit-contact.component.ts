import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DataService } from '../data-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements OnInit {

  contactId: string | null = null;

  editForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    color: new FormControl('#000000')
  });

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute, private router: Router,private dataService: DataService) { }

  ngOnInit(): void {
    this.contactId = this.route.snapshot.paramMap.get('id');
    if (this.contactId) {
      this.firestore.collection('contacts').doc<any>(this.contactId).valueChanges().subscribe(contact => {
        this.editForm.patchValue({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          color: contact.color
        });
      });
    }
  }

  onSubmit() {
    if (this.contactId) {
      this.firestore.collection('contacts').doc<any>(this.contactId).update({
        firstName: this.editForm.get('firstName')?.value ?? '',
        lastName: this.editForm.get('lastName')?.value ?? '',
        email: this.editForm.get('email')?.value ?? '',
        phone: this.editForm.get('phone')?.value ?? '',
        color: this.editForm.get('color')?.value ?? '',
      }).then(() => {
        if (this.contactId) { 
          let updatedContact = {
            id: this.contactId,
            firstName: this.editForm.get('firstName')?.value ?? '',
            lastName: this.editForm.get('lastName')?.value ?? '',
            email: this.editForm.get('email')?.value ?? '',
            phone: this.editForm.get('phone')?.value ?? '',
            color: this.editForm.get('color')?.value ?? '',
          };
          this.dataService.updatedContact$.next(updatedContact);
          console.log('Kontakt erfolgreich aktualisiert.');
        }
      }).catch((error) => {
        console.error('Fehler beim Aktualisieren des Kontakts:', error);
      });
    }
  }  
  
  onSubmitAndNavigate() {
    this.onSubmit();
    this.dataService.refreshContacts();
    this.router.navigate(['/contacts']);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
