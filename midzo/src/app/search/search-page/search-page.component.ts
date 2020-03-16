import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { GeocodingService } from '../../services/geocoding.service'
import { Router } from '@angular/router'


@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  myForm: FormGroup;

  constructor(private fb: FormBuilder, private geocodingService: GeocodingService, private router: Router) { }

  ngOnInit(): void {

    this.myForm = this.fb.group({
      location1: [[],[Validators.required]],
      location2: [[],[Validators.required]]
    })
  }

  
  get location1(){
    return this.myForm.get('location1');
  }

  get location2(){
    return this.myForm.get('location2');
  }

  async submitHandler(){
    const formValue = this.myForm.value;
    const location1 = formValue["location1"]
    const location2 = formValue["location2"]
    const geoData_loc1 = await this.geocodingService.getGeocodeAsync(location1);
    const geoData_loc2 = await this.geocodingService.getGeocodeAsync(location2);
    const lat_loc1 = geoData_loc1["results"][0]["geometry"]["location"]["lat"];
    const lng_loc1 = geoData_loc1["results"][0]["geometry"]["location"]["lng"];
    const lat_loc2 = geoData_loc2["results"][0]["geometry"]["location"]["lat"];
    const lng_loc2 = geoData_loc2["results"][0]["geometry"]["location"]["lng"];
    const lat_mid = (lat_loc1 + lat_loc2) / 2;
    const lng_mid = (lng_loc1 + lng_loc2) / 2;
    console.log(lat_mid)
    console.log(lng_mid)
    this.router.navigate(['/search/result'], { queryParams: { lat: lat_mid, lng: lng_mid } });
  }
}
