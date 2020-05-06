import { Component, Input } from "@angular/core";

@Component({
  selector: "uploader",
  templateUrl: "./uploader.component.html",
  styleUrls: ["./uploader.component.scss"],
})
export class UploaderComponent {
  @Input() destID: string = "testID";
  @Input() uid: string = "testUser";
  @Input() fromOwner: boolean = false;

  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }
}
