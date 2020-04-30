import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";

@Component({
  selector: "app-edit-destination",
  templateUrl: "./edit-destination.component.html",
  styleUrls: ["./edit-destination.component.scss"],
})
export class EditDestinationComponent implements OnInit, OnDestroy {
  destID: string;
  private routerSub: Subscription;
  private destDoc: AngularFirestoreDocument<any>;
  dest: Observable<any>;
  private destSub: Subscription;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore) {}

  ngOnInit(): void {
    this.routerSub = this.route.params.subscribe((params) => {
      this.destID = params["destID"];
    });

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
