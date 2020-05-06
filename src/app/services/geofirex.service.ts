import { Injectable } from '@angular/core';
import * as geofirex from 'geofirex'
import * as firebase from 'firebase/app'
import { environment } from '../../environments/environment';


firebase.initializeApp(environment.firebase)


@Injectable({
  providedIn: 'root'
})
export class GeofirexService {

  constructor() { }

  
  getGeo(){
    return geofirex.init(firebase);
  }
}
