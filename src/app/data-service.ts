import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, firstValueFrom, from, map, Observable } from 'rxjs';
import { ContactInterface, TaskInterface } from './modellInterface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: AngularFirestore) { }

  private _refreshNeeded$ = new BehaviorSubject<void>(undefined);
  readonly refreshNeeded$ = this._refreshNeeded$.asObservable();

  private selectedContactSubject: BehaviorSubject<ContactInterface | null> = new BehaviorSubject<ContactInterface | null>(null);
  selectedContact$ = this.selectedContactSubject.asObservable();

  private selectedTaskSubject: BehaviorSubject<TaskInterface | null> = new BehaviorSubject<TaskInterface | null>(null);
  selectedTask$ = this.selectedTaskSubject.asObservable();

  updatedContact$ = new BehaviorSubject<ContactInterface | null>(null);
  updatedTask$ = new BehaviorSubject<TaskInterface | null>(null);


  async addCategoryFromService(category: string, color: string) {
    const docSnapshot = this.firestore.collection('categories').doc(category).get();

    const doc = await firstValueFrom(docSnapshot);

    if (!doc.data()) {
      this.firestore.collection('categories').doc(category).set({
        category: category,
        color: color
      }).then(() => {
        console.log('Kategorie erfolgreich in Firestore gespeichert.');
      }).catch((error) => {
        console.error('Fehler beim Speichern der Kategorie:', error);
      });
    } else {
      console.log('Kategorie existiert bereits.');
    }
  }


  setSelectedContact(contact: ContactInterface | null) {
    this.selectedContactSubject.next(contact);
  }


  setUpdatedContact(contact: ContactInterface | null) {
    this.updatedContact$.next(contact);
  }


  refreshContacts() {
    this._refreshNeeded$.next();
  }


  getContacts(): Observable<any[]> {
    return this.firestore.collection('contacts').valueChanges();
  }


  addTask(task: TaskInterface): Promise<void> {
    return this.firestore.collection('tasks').doc(task.id).set(task);
  }


  updateTask(id: string, task: TaskInterface): Promise<void> {
    return this.firestore.collection('tasks').doc(id).update(task);
  }
  


  getTaskById(id: string): Observable<TaskInterface | undefined> {
    return this.firestore.collection('tasks').doc<TaskInterface>(id).snapshotChanges()
      .pipe(
        map(doc => {
          if (!doc.payload.exists) {
            return undefined;
          } else {
            const data = doc.payload.data() as TaskInterface;
            const docId = doc.payload.id;
            return { id: docId, ...data };
          }
        })
      );
  }  


  getTasks(): Observable<TaskInterface[]> {
    return this.firestore.collection<TaskInterface>('tasks').valueChanges();
  }


  setSelectedTask(task: TaskInterface | null) {
    this.selectedTaskSubject.next(task);
  }


  setUpdatedTask(task: TaskInterface | null) {
    this.updatedTask$.next(task);
  }


  refreshTasks() {
    this._refreshNeeded$.next();
  }


  deleteTask(taskId: string): Observable<void> {
    return from(this.firestore.collection('tasks').doc(taskId).delete());
  }

  getCategories(): Observable<any[]> {
    return this.firestore.collection('categories').valueChanges();
  }
}
