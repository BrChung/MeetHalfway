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

const components = [
  ShellComponent,
  DropzoneDirective,
  UploaderComponent,
  UploadDestPhotoComponent,
];

const modules = [
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  LayoutModule,
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
  CommonModule,
];

@NgModule({
  declarations: [...components, ShellComponent],
  imports: [...modules],
  exports: [...components, ...modules, ShellComponent, UploaderComponent],
})
export class SharedModule {}
