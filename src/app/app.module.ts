import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";
import { HomePageComponent } from "./home-page/home-page.component";
import { environment } from "../environments/environment";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";

import { GeofirexService } from "./services/geofirex.service";
import { GeocodingService } from "./services/geocoding.service";

import { HttpClientModule } from "@angular/common/http";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";

import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

import { AgmCoreModule } from "@agm/core";

import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ProfilePageComponent } from "./profile-page/profile-page.component";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    EditProfileComponent,
    ProfilePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxIntlTelInputModule,
    BsDropdownModule.forRoot(),
    AgmCoreModule.forRoot(environment.googleMaps),
  ],
  providers: [GeofirexService, GeocodingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
