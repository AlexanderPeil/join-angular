import { Injectable, NgZone } from '@angular/core';
import { User } from '../../../shared/models/user';
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
import {
  Auth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  signInAnonymously,
  GoogleAuthProvider,
  signOut,
  deleteUser,
  onAuthStateChanged,
  getAuth,
  updateEmail,
  confirmPasswordReset,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root',
})


export class AuthService {
  userData: any;
  private userSubscription?: Subscription;


  constructor(
    private firestore: Firestore,
    public auth: Auth,
    public router: Router,
    public ngZone: NgZone
  ) { }


  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await this.router.navigate(['summary']);
      }
    } catch (err) {
      console.error('An unexpected error occurred. Please try again', err);
      throw err;
    }
  }


  async signInAnonymously() {
    try {
      const userCredential = await signInAnonymously(this.auth);
      if (userCredential.user) {
        await this.router.navigate(['summary']);
      }
    } catch (err) {
      console.error('Sign in failed:', err); {
        throw err;
      }
    }
  }


  async signUp(displayName: string, email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await this.router.navigate(['summary']);
      }
    } catch (err) {
      console.error(err); {
        throw err;
      }
    }
  }


  async forgotPassword(passwordResetEmail: string) {
    try {
      await sendPasswordResetEmail(this.auth, passwordResetEmail);
    } catch (error) {
      console.log('An unexpected error occurred. Please try again', error);
      throw error;
    }
  }


  async setUserData(user: FirebaseUser, isOnline?: boolean) {
    const { uid, email, displayName, emailVerified, photoURL } = user;
    const userData: User = {
      uid,
      email: email || null,
      displayName: displayName || null,
      displayNameLower: displayName?.toLowerCase() || null,
      emailVerified,
      photoURL,
      ...(typeof isOnline !== 'undefined' && { isOnline }),
    };
    await setDoc(doc(this.firestore, `users/${uid}`), userData);
    return userData;
  }


  async signOut() {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      if (currentUser.displayName === 'Guest') {
        await this.deleteGuestUser(currentUser.uid);
      } else {
        await this.setUserOnlineStatus(currentUser.uid, false);
      }
    }
    await signOut(this.auth);
    this.router.navigate(['login']);
  }


  async deleteGuestUser(uid: string) {
    try {
      if (this.auth.currentUser && this.auth.currentUser.uid === uid) {
        await deleteUser(this.auth.currentUser);
      }
      await deleteDoc(doc(this.firestore, 'users', uid));
      this.userSubscription?.unsubscribe();
    } catch (error) {
      console.error('Error during deleting guest user:', error);
    }
  }


  async setUserOnlineStatus(uid: string, isOnline: boolean) {
    // const userRef = doc(this.firestore, `users/${uid}`);
    // await updateDoc(userRef, {
    //   isOnline: isOnline,
    // });
  }
}