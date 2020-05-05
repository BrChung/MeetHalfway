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

  constructor(
    private route: ActivatedRoute, 
    private afs: AngularFirestore
  ) {}

  //Photos, reviews (stars and count), change title based on biz
  ngOnInit(): void {
    this.routerSub = this.route.params.subscribe((params) => {
      this.destID = params["destID"];
    });

    //Use get instead
    this.destDoc = this.afs.doc<any>(`destinations/${this.destID}`);
    this.destSub = this.destDoc.snapshotChanges().subscribe((data) => {
      if (data.payload.exists) {
        console.log("exists");
        this.dest = data.payload.data();
      } else {
        console.log("N/A");
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.destSub.unsubscribe();
  }
}
