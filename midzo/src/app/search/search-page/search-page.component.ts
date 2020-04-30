import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { GeocodingService } from "../../services/geocoding.service";
import { Router } from "@angular/router";
import { Category } from "../../models/category";
import { RtlScrollAxisType } from '@angular/cdk/platform';

@Component({
  selector: "app-search-page",
  templateUrl: "./search-page.component.html",
  styleUrls: ["./search-page.component.scss"],
})
export class SearchPageComponent implements OnInit {
  bgImage: string;
  myForm: FormGroup;

  categories: Category[] = [
    { value: "n/a", viewValue: "Any" },
    { value: "date", viewValue: "Date" },
    { value: "study", viewValue: "Study" },
    { value: "business", viewValue: "Business" },
    { value: "food", viewValue: "Food" },
  ];

  constructor(
    private fb: FormBuilder,
    private geocodingService: GeocodingService,
    private router: Router
  ) {
    this.getBackground()
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      location1: [[], [Validators.required]],
      location2: [[], [Validators.required]],
      meetingType: ['n/a', []],
    });
  }

  getBackground() {
    let urls: string[] = ["https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg",
                          "https://images.pexels.com/photos/3626622/pexels-photo-3626622.jpeg",
                          "https://images.pexels.com/photos/1015568/pexels-photo-1015568.jpeg",
                          "https://images.pexels.com/photos/3851376/pexels-photo-3851376.jpeg",
                          "https://images.pexels.com/photos/2130137/pexels-photo-2130137.jpeg",
                          "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"];
    let rand = Math.floor(Math.random() * urls.length);
    this.bgImage = urls[rand];  
  }

  get location1() {
    return this.myForm.get("location1");
  }

  get location2() {
    return this.myForm.get("location2");
  }

  get meetingType() {
    return this.myForm.get("meetingType");
  }

  async submitHandler() {
    const formValue = this.myForm.value;
    const location1 = formValue["location1"];
    const location2 = formValue["location2"];
    var meetingType = [];

    if(this.myForm.valid) {
      if (
        formValue["meetingType"] !== "n/a" &&
        formValue["meetingType"] !== null
      ) {
        meetingType.push(formValue["meetingType"]);
      }
      const geoData_loc1 = await this.geocodingService.getGeocodeAsync(location1);
      const geoData_loc2 = await this.geocodingService.getGeocodeAsync(location2);
      const lat_loc1 = geoData_loc1["results"][0]["geometry"]["location"]["lat"];
      const lng_loc1 = geoData_loc1["results"][0]["geometry"]["location"]["lng"];
      const lat_loc2 = geoData_loc2["results"][0]["geometry"]["location"]["lat"];
      const lng_loc2 = geoData_loc2["results"][0]["geometry"]["location"]["lng"];
      const lat_mid = (lat_loc1 + lat_loc2) / 2;
      const lng_mid = (lng_loc1 + lng_loc2) / 2;
      this.router.navigate(["/result"], {
        queryParams: { lat: lat_mid, lng: lng_mid, tag: meetingType },
      });
    }
  }
}
