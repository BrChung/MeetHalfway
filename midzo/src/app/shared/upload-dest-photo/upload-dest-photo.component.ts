import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";

@Component({
  selector: "app-upload-dest-photo",
  templateUrl: "./upload-dest-photo.component.html",
  styleUrls: ["./upload-dest-photo.component.scss"],
})
export class UploadDestPhotoComponent implements OnInit {
  @Input() file: File;
  @Input() destID: string;
  @Input() uid: string;
  @Input() fromOwner: boolean = false;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {
    if (this.file.type.split("/")[0] !== "image") {
      console.log("Unsupported File Type!");
      return;
    }

    // The storage path
    const path = `destination/${this.destID}/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        this.db.collection("destination-images").add({
          destID: this.destID,
          downloadURL: this.downloadURL,
          path,
          uid: this.uid,
          dateUploaded: Date.now(),
          fromOwner: this.fromOwner,
        });
      })
    );
  }

  isActive(snapshot) {
    return (
      snapshot.state === "running" &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}
