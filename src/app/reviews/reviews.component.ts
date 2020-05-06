import { Component, OnInit, Input } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, of } from "rxjs";
import { switchMap, first, map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { firestore } from "firebase/app";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ValidationErrors,
  AbstractControl,
} from "@angular/forms";

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.scss"],
})
export class ReviewsComponent implements OnInit {
  @Input() destID: string = "the-factory-bouldering";

  addReviewForm: FormGroup;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addReviewForm = this.fb.group({
      review: [[], [Validators.required, Validators.maxLength(2200)]],
      stars: [
        null,
        [Validators.required, Validators.min(0), Validators.max(5)],
      ],
    });
  }

  get review() {
    return this.addReviewForm.get("review");
  }

  get stars() {
    return this.addReviewForm.get("stars");
  }

  async postReview() {
    const { uid } = await this.afAuth.user.pipe(first()).toPromise();

    const formValue = this.addReviewForm.value;

    console.log(this.destID);
    console.log(uid);
    console.log(formValue["review"]);
    const data = {
      uid,
      content: formValue["review"],
      stars: Number(formValue["stars"]),
      createdAt: Date.now(),
    };

    if (uid) {
      const ref = this.afs.collection("reviews").doc(this.destID);
      return ref.update({ reviews: firestore.FieldValue.arrayUnion(data) });
    }
  }
}
