import { Directive, HostListener } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { User } from "../models/user";

import * as firebase from "firebase/app";

@Directive({
  selector: "[appGoogleSignin]",
})
export class GoogleSigninDirective {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  @HostListener("click")
  onclick() {
    this.googleSignIn();
  }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData({ uid, email, displayName, photoURL }: User) {
    //Sets user data to firestore on login for more accurate data
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    const data = {
      uid,
      email,
      displayName,
      photoURL,
      roles: {
        subscriber: true,
      },
    };

    return userRef.set(data, { merge: true });
  }
}
