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
    const idx = this.file.name.lastIndexOf(".");
    if (idx > -1) {
      var thumbFileName =
        this.file.name.substr(0, idx) + "_250x200" + this.file.name.substr(idx);
    }
    const thumbPath = `destination/${
      this.destID
    }/${Date.now()}_${thumbFileName}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);
    const thumbRef = this.storage.ref(thumbPath);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        const thumbURL = await keepTrying(10, thumbRef);
        console.log(thumbURL);

        this.db.collection("destination-images").add({
          destID: this.destID,
          downloadURL: this.downloadURL,
          thumbURL: thumbURL,
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
//https://stackoverflow.com/questions/58977241/how-to-get-the-resized-downloadurl-after-upload-with-firebase-storage-web-sdk
function delay(t, v?) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

async function keepTrying(triesRemaining, storageRef) {
  if (triesRemaining < 0) {
    return Promise.reject("out of tries");
  }

  return await storageRef
    .getDownloadURL()
    .toPromise()
    .catch((error) => {
      switch (error.code) {
        case "storage/object-not-found":
          return delay(2000).then(() => {
            return keepTrying(triesRemaining - 1, storageRef);
          });
        default:
          console.log(error);
          return Promise.reject(error);
      }
    });
}
