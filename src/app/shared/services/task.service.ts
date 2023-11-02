import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  docData,
  updateDoc,
  collection,
  collectionData,
  deleteDoc,
  query,
  where,
  Query,
  DocumentData
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Task } from 'src/app/shared/models/tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: Firestore) {}


}
