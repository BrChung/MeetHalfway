import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { User } from "../../models/user";

@Component({
  selector: "app-email-login",
  templateUrl: "./email-login.component.html",
  styleUrls: ["./email-login.component.scss"],
})
export class EmailLoginComponent implements OnInit {
  form: FormGroup;

  type: "login" | "signup" | "reset" = "signup";
  loading = false;

  serverMessage: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ["", []],
    });
  }

  changeType(val) {
    this.type = val;
  }

  //Form getters for current form type
  get isLogin() {
    return this.type === "login";
  }
  get isSignup() {
    return this.type === "signup";
  }
  get isPasswordReset() {
    return this.type === "reset";
  }

  //Form getters for form content
  get email() {
    return this.form.get("email");
  }
  get password() {
    return this.form.get("password");
  }
  get passwordConfirm() {
    return this.form.get("passwordConfirm");
  }

  //Getter to check if passwords match
  get passwordDoesMatch() {
    //If not currently a signup form return true
    if (this.type !== "signup") {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  //Upon form submission
  async onSubmit() {
    this.loading = true;
    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      }
      if (this.isSignup) {
        const credential = await this.afAuth.auth.createUserWithEmailAndPassword(
          email,
          password
        );
        this.updateUserData(credential.user);
      }
      if (this.isPasswordReset) {
        await this.afAuth.auth.sendPasswordResetEmail(email);
        this.serverMessage = "Check your email";
      }
    } catch (error) {
      this.serverMessage = error;
    }

    this.loading = false;
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
