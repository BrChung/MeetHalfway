import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Form, Validators, FormArray, FormControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


export interface UserProfile {}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})

export class EditProfileComponent implements OnInit, OnDestroy {

  profileID: string;
  pageState = true; //if data is loaded

  selectGender : any
  genders: string[] = ['Male', 'Female', 'Other', 'N/A'];
  options: string[];
  filteredInterestOptions: string[][] = [];
  filteredFoodOptions: string[][] = [];



  profile: Observable<any>;
  profileDoc: AngularFirestoreDocument<any>;
  private profileSub: Subscription;
  private routerSub: Subscription;
  private interestSub: Subscription;
  private foodSub: Subscription;

  editProfileForm: FormGroup;

  constructor(private route: ActivatedRoute, 
    private afs:AngularFirestore,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.routerSub = this.route.params.subscribe((params) => {
      this.profileID = params["uid"];
    });

    this.editProfileForm = this.fb.group({
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
    });


    this.profileDoc = this.afs.doc<any>(`profile/${this.profileID}`);
    this.profileSub = this.profileDoc.snapshotChanges().subscribe((data) => {
        if (data.payload.exists) {
          console.log("exists");
          this.profile = data.payload.data();
          console.log(this.profile);
        } else {
          console.log("N/A");
        }

        for (let i = 0; i < this.profile["interests"].length - 1; i++) {
          this.addInterest();
        }

        for (let i = 0; i < this.profile["favoriteFoods"].length - 1; i++) {
          this.addFavoriteFood();
        }

        this.editProfileForm.setValue({
          name: this.profile["name"], 
          email: this.profile["email"],
          city: this.profile["city"], 
          gender: this.profile["gender"], 
          career: this.profile["career"],
          favoriteFoods: this.profile["favoriteFoods"],
          interests: this.profile["interests"]
        })

        this.interestSub = this.editProfileForm
          .get("interests")
          .valueChanges.subscribe((categories) => {
            categories.forEach((element, index) => {
              this.filteredInterestOptions[index] = this._filter(element);
            });
          });

        this.foodSub = this.editProfileForm
        .get("favoriteFoods")
        .valueChanges.subscribe((categories) => {
          categories.forEach((element, index) => {
            this.filteredFoodOptions[index] = this._filter(element);
          });
        });
      });

    }

    ngOnDestroy(): void {
      this.routerSub.unsubscribe();
      this.profileSub.unsubscribe();
    }
    

    //For food
    get foodForms() {
      return this.editProfileForm.get('favoriteFoods') as FormArray
    }

    // addFavoriteFood() {
    //   this.foodForms.push(
    //     new FormControl("", [Validators.required, this.requireMatch.bind(this)])
    //   )
    // }

  
    addFavoriteFood()
    {
      const foodList = this.fb.group({
        favFood: [] //key and formControlName
      })
  
      this.foodForms.push(foodList);
    }
  
    deleteFavoriteFood(i) {
      this.foodForms.removeAt(i);
    }

    //For interests
    get interestForms() {
      return this.editProfileForm.get('interests') as FormArray
    }

    addInterest()
    {
      const interestList = this.fb.group({
        interest: [] //key and formControlName
      })
  
      this.interestForms.push(interestList);
    }
    
    deleteInterest(i) {
      this.interestForms.removeAt(i);
    }

    // addInterest() {
    //   this.interestForms.push(
    //     new FormControl("", [Validators.required, this.requireMatch.bind(this)])
    //   )
    // }
    
    private requireMatch(control: FormControl): ValidationErrors | null {
      const selection: any = control.value;
      if (this.options && this.options.indexOf(selection) < 0) {
        return { requireMatch: true };
      }
      return null;
    }


    get name()
    {
      return this.editProfileForm.get('name')
    }
  
    get email()
    {
      return this.editProfileForm.get('email')
    }
  
    get city()
    {
      return this.editProfileForm.get('city')
    }
  
    get favorites()
    {
      return this.editProfileForm.get('favorites')
    }
    
    get career()
    {
      return this.editProfileForm.get('career')
    }

    get gender()
    {
      return this.selectGender
    }

    async submitHandler() {
      const formValue = this.editProfileForm.value;
      formValue["interests"] = removeDuplicates(formValue["interests"]);
      formValue["favoriteFoods"] = removeDuplicates(formValue["favoriteFoods"]);
      console.log(formValue);
   }

   private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  updateUserProfileData() {

    const formValue = this.editProfileForm.value;
    console.log(formValue)
    //Sets user data to firestore on login for more accurate data
    
    const userRef: AngularFirestoreDocument<UserProfile> = this.afs.doc(
      `profile/${this.profileID}`
    );

    const data = {
      uid: this.profileID,
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
  function removeDuplicates(array: Array<string>) {
    return array.filter((a, b) => array.indexOf(a) === b);
  }
