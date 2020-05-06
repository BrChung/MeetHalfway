import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";

@Component({
  selector: "app-view-destination",
  templateUrl: "./view-destination.component.html",
  styleUrls: ["./view-destination.component.scss"],
})
export class ViewDestinationComponent implements OnInit, OnDestroy {
  destID: string;
  private routerSub: Subscription;
  private destDoc: AngularFirestoreDocument<any>;
  dest: any;
  private destSub: Subscription;
  destPhoto: any;
  imageObject = [];
  private destPhotoSub: Subscription;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) {}

  //Photos, reviews (stars and count), change title based on biz
  ngOnInit(): void {
    this.routerSub = this.route.params.subscribe((params) => {
      this.destID = params["destID"];
    });

    //Use get instead
    this.destDoc = this.afs.doc<any>(`destinations/${this.destID}`);
    this.destSub = this.destDoc.snapshotChanges().subscribe((data) => {
      if (data.payload.exists) {
        this.dest = data.payload.data();
      } else {
        console.log("N/A");
      }
    });

    const photoRef = this.afs.collection("destination-images", (ref) =>
      ref.where("destID", "==", this.destID)
    );
    this.destPhotoSub = photoRef.valueChanges().subscribe((data) => {
      if (data) {
        this.imageObject = [];
        data.forEach((photo) => {
          this.imageObject.push({
            image: photo["downloadURL"],
            thumbImage: photo["thumbURL"],
          });
        });
        this.destPhoto = data;
        console.log("Destination Photos:", this.imageObject);
      } else {
        console.log("N/A");
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.destSub.unsubscribe();
    this.destPhotoSub.unsubscribe();
  }
}
