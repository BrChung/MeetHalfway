import { Component, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ValidationErrors,
  AbstractControl,
} from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { tap, first, map, take, debounceTime, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFireModule } from "@angular/fire";

import { GeocodingService } from "../../services/geocoding.service";
import { GeofirexService } from "../../services/geofirex.service";
import { Category } from "src/app/models/category";

import { TooltipLabel, CountryISO } from "ngx-intl-tel-input";

@Component({
  selector: "app-add-destination-page",
  templateUrl: "./add-destination-page.component.html",
  styleUrls: ["./add-destination-page.component.scss"],
})
export class AddDestinationPageComponent implements OnInit {
  addDestForm: FormGroup;
  options: string[] = ["Date", "Study", "Business", "Food"];
  filteredOptions: string[][] = [];

  // Form State
  loading = false;
  success = false;
  previousFormState: any;
  serverMessage: string;

  // Geocode Value
  geocode: any;

  // GeoFireX
  geo: any;

  separateDialCode = false;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private geocodingService: GeocodingService,
    private goefirex: GeofirexService
  ) {}

  ngOnInit(): void {
    // Init GeoFireX
    this.geo = this.goefirex.getGeo();

    this.addDestForm = this.fb.group({
      name: [[], [Validators.required, Validators.minLength(4)]],
      destID: [
        [],
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern("^[a-z0-9]+(-[a-z0-9]+)*$"),
        ],
        DestinationValidator.destID(this.afs),
      ],
      streetAddress: [[], [Validators.required]],
      zipCode: [[], [Validators.required, Validators.pattern("^\\d{5}$")]],
      phoneNumber: new FormControl(undefined, [Validators.required]),
      website: [
        null,
        [
          // RegEx from https://gist.github.com/dperini/729294 Credit: @diegoperini
          Validators.pattern(
            "^(?:(?:(?:https?|ftp):)?//)(?:S+(?::S*)?@)?(?:(?!(?:10|127)(?:.d{1,3}){3})(?!(?:169.254|192.168)(?:.d{1,3}){2})(?!172.(?:1[6-9]|2d|3[0-1])(?:.d{1,3}){2})(?:[1-9]d?|1dd|2[01]d|22[0-3])(?:.(?:1?d{1,2}|2[0-4]d|25[0-5])){2}(?:.(?:[1-9]d?|1dd|2[0-4]d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff].)+(?:[a-z\u00a1-\uffff]{2,}.?))(?::d{2,5})?(?:[/?#]S*)?$"
          ),
        ],
      ],
      categories: this.fb.array([
        this.fb.control("", [
          Validators.required,
          this.requireMatch.bind(this),
        ]),
      ]),
    });

    this.addDestForm.valueChanges.subscribe((formValue) => {
      if (this.previousFormState === undefined) {
        this.previousFormState = formValue;
      }
      if (
        typeof formValue.name === "string" &&
        formValue.name !== this.previousFormState.name
      ) {
        this.addDestForm.patchValue(
          {
            destID: formValue.name
              .replace(/\s+/g, "-")
              .replace(/[!@#$%^&*()_+|~=`{}\\\[\]:";'<>?,.\/]/g, "")
              .toLowerCase(),
          },
          { emitEvent: false, onlySelf: true }
        );
      }
      this.previousFormState = formValue;

      formValue.categories.forEach((element, index) => {
        this.filteredOptions[index] = this._filter(element);
      });
    });
  }
  get name() {
    return this.addDestForm.get("name");
  }

  get destID() {
    return this.addDestForm.get("destID");
  }

  get streetAddress() {
    return this.addDestForm.get("streetAddress");
  }

  get zipCode() {
    return this.addDestForm.get("zipCode");
  }

  get phoneNumber() {
    return this.addDestForm.get("phoneNumber");
  }

  get website() {
    return this.addDestForm.get("website");
  }

  get categories() {
    return this.addDestForm.get("categories") as FormArray;
  }

  addCategory() {
    this.categories.push(
      new FormControl("", [Validators.required, this.requireMatch.bind(this)])
    );
  }

  deleteCategory(index: number) {
    this.categories.removeAt(index);
  }

  //Writing the Data to FireStore
  async submitHandler() {
    this.loading = true;
    this.serverMessage = undefined;

    const formValue = this.addDestForm.value;
    const streetAddress = formValue["streetAddress"];
    const zipCode = formValue["zipCode"];
    const fullAddress = streetAddress.concat(" ", zipCode);
    const data = await this.geocodingService.getGeocodeAsync(fullAddress);
    if (data["status"] === "OK") {
      const latLng = data["results"][0]["geometry"]["location"];
      const formattedAddress = data["results"][0]["formatted_address"];
      const position = this.geo.point(latLng["lat"], latLng["lng"]);
      formValue["position"] = position;
      formValue["address"] = formattedAddress;

      /*

      TO CHECK:
      Check if buisness already exists with address, if so. We cannot add the business
      Show location on a map

      */
      try {
        await this.afs
          .collection("destinations")
          .doc(formValue.destID)
          .set(formValue, { merge: true });
        this.success = true;
      } catch (err) {
        console.error(err);
      }
    } else if (data["status"] === "ZERO_RESULTS") {
      this.serverMessage =
        "Sorry, we could not find the address you submitted. Please try again!";
    } else {
      this.serverMessage = "Unknown Error! Please contact support.";
    }

    this.loading = false;
  }

  private requireMatch(control: FormControl): ValidationErrors | null {
    const selection: any = control.value;
    if (this.options && this.options.indexOf(selection) < 0) {
      return { requireMatch: true };
    }
    return null;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}

export class DestinationValidator {
  static destID(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      const destID = control.value.toLowerCase();

      return afs
        .collection("destinations", (ref) => ref.where("destID", "==", destID))

        .valueChanges()
        .pipe(
          debounceTime(1000),
          take(1),
          // tap(() => console.log("external call")),
          map((arr) => (arr.length ? { destinationAvaliable: false } : null))
        );
    };
  }
}
