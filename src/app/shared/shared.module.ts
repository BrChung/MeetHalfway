import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { LayoutModule } from "@angular/cdk/layout";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatRippleModule } from "@angular/material/core";
import { ShellComponent } from "./shell/shell.component";
import { DropzoneDirective } from "./dropzone.directive";
import { UploaderComponent } from "./uploader/uploader.component";
import { UploadDestPhotoComponent } from "./upload-dest-photo/upload-dest-photo.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { NgImageSliderModule } from "ng-image-slider";

const components = [
  ShellComponent,
  DropzoneDirective,
  UploaderComponent,
  UploadDestPhotoComponent,
  ReviewsComponent,
];

const modules = [
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  LayoutModule,
  FormsModule,
  ReactiveFormsModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  RouterModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatRippleModule,
  NgImageSliderModule,
  CommonModule,
];

@NgModule({
  declarations: [...components, ShellComponent],
  imports: [...modules],
  exports: [
    ...components,
    ...modules,
    ShellComponent,
    UploaderComponent,
    ReviewsComponent,
  ],
})
export class SharedModule {}
