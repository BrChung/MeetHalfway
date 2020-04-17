import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule, Validators } from '@angular/forms';

//only work here
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})


export class ProfilePageComponent implements OnInit {
 
  myForm: FormGroup;
 
  constructor(private fb: FormBuilder) { }

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
    this.myForm.valueChanges.subscribe(console.log);
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
  
  get activities()
  {
    return this.myForm.get('activities')
  }

  get gender()
  {
    return this.selectGender
  }
}