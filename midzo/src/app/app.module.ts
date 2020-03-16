import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HomePageComponent } from './home-page/home-page.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireAuthModule } from '@angular/fire/auth'

import { GeofirexService } from './services/geofirex.service';
import { GeocodingService } from './services/geocoding.service';

import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule
  ],
  providers: [
    GeofirexService,
    GeocodingService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
