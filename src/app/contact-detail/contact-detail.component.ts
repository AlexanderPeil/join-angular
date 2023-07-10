import { Component } from '@angular/core';
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
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent {

  constructor(private firestore: AngularFirestore) { }

}
