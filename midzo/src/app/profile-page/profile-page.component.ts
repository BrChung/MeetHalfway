import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { FormBuilder, FormGroup, FormArray, FormsModule, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { UserProfile } from "../models/profile";
import { getMatIconNameNotFoundError } from '@angular/material/icon';
import { Router } from '@angular/router';


//only work here
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})


export class ProfilePageComponent implements OnInit {
  
  myForm: FormGroup;
  uid;
  //items: Observable<UserProfile[]>

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: FormBuilder) {this.afAuth.authState.subscribe(user => { //If logged in, subscribe to the user, get uid. If not, set to null
      if(user) {
        this.uid = user.uid;
      } else {
        // Empty the value when user signs out
        this.uid = null;
      }
    }); }

  selectGender : any
  genders: string[] = ['Male', 'Female', 'Other', 'N/A'];
 
  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['',[
        Validators.required,
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      city: ['',[
        Validators.required,
      ]],
      gender: ['',[
        Validators.required,
      ]],
      career: ['',[
        Validators.required,
      ]],
      favoriteFoods: this.fb.array([]),
      interests: this.fb.array([])
    })
    //this.myForm.valueChanges.subscribe(console.log);
  }

 
 
  //For food
  get foodForms() {
    return this.myForm.get('favoriteFoods') as FormArray
  }
 
  addFavoriteFood()
  {
    const favorite = this.fb.group({
      favFood: [] //key and formControlName
    })
 
    this.foodForms.push(favorite);
  }
 
  deleteFavoriteFood(i) {
    this.foodForms.removeAt(i);
  }

  //For interests
  get interestForms() {
    return this.myForm.get('interests') as FormArray
  }
 
  addInterest()
  {
    const favorite = this.fb.group({
      interest: [] //key and formControlName
    })
 
    this.interestForms.push(favorite);
  }
 
  deleteInterest(i) {
    this.interestForms.removeAt(i);
  }

  get name()
  {
    return this.myForm.get('name')
  }
 
  get email()
  {
    return this.myForm.get('email')
  }
 
  get city()
  {
    return this.myForm.get('city')
  }
 
  get favorites()
  {
    return this.myForm.get('favorites')
  }

  get career()
  {
    return this.myForm.get('career')
  }

  get gender()
  {
    return this.selectGender
  }


  updateUserProfileData() {

    const formValue = this.myForm.value;
    console.log(formValue)
    //Sets user data to firestore on login for more accurate data
    
    const userRef: AngularFirestoreDocument<UserProfile> = this.afs.doc(
      `profile/${this.uid}`
    );

    const data = {
      uid: this.uid,
      name: formValue["name"], 
      email: formValue["email"],
      city: formValue["city"], 
      gender: formValue["gender"], 
      career: formValue["career"],
      favoriteFoods: formValue["favoriteFoods"],
      interests: formValue["interests"]
    };

    return userRef.set({...data}, { merge: true });
  };
}
 
// work on editing the current values. this adds values, so we need to edit them. if the profile or user id exists,
//extract the data and edit it. put the values as the default data in the form

