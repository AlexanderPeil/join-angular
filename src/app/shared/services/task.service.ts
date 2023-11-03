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
  DocumentData,
  addDoc
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Task } from '../models/task-model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: Firestore) {}


  async addTask(task: Task): Promise<void> {
    const tasksCollectionRef = collection(this.firestore, 'tasks');

    try {
      await addDoc(tasksCollectionRef, task);
    } catch (error) {
      console.error("Error adding document: ", error);
      throw new Error('Error adding task to Firestore');
    }
  }

}
