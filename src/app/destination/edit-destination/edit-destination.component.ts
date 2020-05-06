import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ValidationErrors,
  AbstractControl,
  NgControl,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import {
  tap,
  first,
  map,
  take,
  debounceTime,
  startWith,
  finalize,
} from "rxjs/operators";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuth } from "@angular/fire/auth";

import { GeocodingService } from "../../services/geocoding.service";
import { GeofirexService } from "../../services/geofirex.service";
import { Category } from "src/app/models/category";

import { TooltipLabel, CountryISO } from "ngx-intl-tel-input";
import { $ } from "protractor";
import { getSupportedInputTypes } from "@angular/cdk/platform";

@Component({
  selector: "app-edit-destination",
  templateUrl: "./edit-destination.component.html",
  styleUrls: ["./edit-destination.component.scss"],
})
export class EditDestinationComponent implements OnInit, OnDestroy {
  // Page State
  pageState = true; // If data is loaded
  success = false;
  loading = false;
  disableDeleteCat = true;
  disableAddCat = false;
  serverMessage: string;

  // Map
  latitude: number;
  longitude: number;
  map_cover_visibility = "hidden";

  destID: string;
  private routerSub: Subscription;
  private categorySub: Subscription;
  private addressSub: Subscription;
  private destDoc: AngularFirestoreDocument<any>;
  dest: Observable<any>;
  private destSub: Subscription;

  editDestForm: FormGroup;
  options: string[] = ["Date", "Study", "Business", "Food"];
  filteredOptions: string[][] = [];

  separateDialCode = false;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;

  uid: string;
  fromOwner = true;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getUID();
    this.routerSub = this.route.params.subscribe((params) => {
      this.destID = params["destID"];
    });

    this.editDestForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ],
      ],
      address: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(95),
        ],
      ],
      phoneNumber: new FormControl(undefined, [Validators.required]),
      website: [
        null,
        [
          // RegEx from https://gist.github.com/dperini/729294 Credit: @diegoperini
          Validators.pattern(
            "^(?:(?:(?:https?|ftp):)?//)(?:S+(?::S*)?@)?(?:(?!(?:10|127)(?:.d{1,3}){3})(?!(?:169.254|192.168)(?:.d{1,3}){2})(?!172.(?:1[6-9]|2d|3[0-1])(?:.d{1,3}){2})(?:[1-9]d?|1dd|2[01]d|22[0-3])(?:.(?:1?d{1,2}|2[0-4]d|25[0-5])){2}(?:.(?:[1-9]d?|1dd|2[0-4]d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff].)+(?:[a-z\u00a1-\uffff]{2,}.?))(?::d{2,5})?(?:[/?#]S*)?$"
          ),
          Validators.maxLength(50),
        ],
      ],
      categories: this.fb.array(
        [
          this.fb.control("", [
            Validators.required,
            this.requireMatch.bind(this),
          ]),
        ],
        [Validators.required, Validators.maxLength(5)]
      ),
      description: [[], [Validators.required, Validators.maxLength(1000)]],
    });

    this.destDoc = this.afs.doc<any>(`destinations/${this.destID}`);
    this.destSub = this.destDoc.snapshotChanges().subscribe((data) => {
      if (data.payload.exists) {
        this.dest = data.payload.data();
        console.log(this.dest["position"]["geopoint"]["latitude"]);

        for (let i = 0; i < this.dest["categories"].length - 1; i++) {
          this.addCategory();
        }
        this.editDestForm.setValue({
          name: this.dest["name"],
          address: this.dest["address"],
          phoneNumber: this.dest["phoneNumber"]["number"],
          website: this.dest["website"],
          categories: this.dest["categories"],
          description: this.dest["description"],
        });

        this.latitude = this.dest["position"]["geopoint"]["latitude"];
        this.longitude = this.dest["position"]["geopoint"]["longitude"];

        this.categorySub = this.editDestForm
          .get("categories")
          .valueChanges.subscribe((categories) => {
            categories.forEach((element, index) => {
              this.filteredOptions[index] = this._filter(element);
            });
          });

        this.addressSub = this.editDestForm
          .get("address")
          .valueChanges.pipe(
            tap(() => {
              console.log("hi");
              this.map_cover_visibility = "visible";
            }),
            debounceTime(2000)
          )
          .subscribe((address) => {
            if (address.length >= 10) {
              console.log("extranal call");
            }
          });
      } else {
        console.log("N/A");
        this.pageState = false;
      }
    });
  }

  async getUID() {
    const { uid } = await this.afAuth.user.pipe(first()).toPromise();
    this.uid = uid;
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.destSub.unsubscribe();
    this.categorySub.unsubscribe();
    this.addressSub.unsubscribe();
  }

  get name() {
    return this.editDestForm.get("name");
  }

  get phoneNumber() {
    return this.editDestForm.get("phoneNumber");
  }

  get website() {
    return this.editDestForm.get("website");
  }

  get categories() {
    return this.editDestForm.get("categories") as FormArray;
  }

  get description() {
    return this.editDestForm.get("description");
  }

  addCategory() {
    this.categories.push(
      new FormControl("", [Validators.required, this.requireMatch.bind(this)])
    );
    if (this.categories.length > 1) {
      this.disableDeleteCat = false;
    }
    if (this.categories.length >= 5) {
      this.disableAddCat = true;
    }
  }

  deleteCategory(index: number) {
    this.categories.removeAt(index);
    if (this.categories.length <= 1) {
      this.disableDeleteCat = true;
    }
    if (this.categories.length <= 4) {
      this.disableAddCat = false;
    }
  }

  async submitHandler() {
    const formValue = this.editDestForm.value;
    formValue["categories"] = removeDuplicates(formValue["categories"]);
    console.log(formValue);
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

function removeDuplicates(array: Array<string>) {
  return array.filter((a, b) => array.indexOf(a) === b);
}
