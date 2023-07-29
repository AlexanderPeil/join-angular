import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})


export class AuthService {
  userData: any;


  constructor(
    public afs: AngularFirestore, 
    public afAuth: AngularFireAuth, 
    public router: Router,
    public ngZone: NgZone 
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }


  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['summary']);
          }
        });
      })
      .catch((error) => {
        return Promise.reject(error.message); 
      });
  }


  signInAnonymously() {
    return this.afAuth.signInAnonymously()
      .then((result) => {
        this.setUserData(result.user);
        this.router.navigate(['summary']);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }


  signUp(displayName: string, email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user) {
          result.user.updateProfile({
            displayName: displayName
          }).then(() => {
            this.setUserData(result.user);
            this.router.navigate(['summary']);
          });
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }


  forgotPassword(passwordResetEmail: string) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }



  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }


  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }


  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}