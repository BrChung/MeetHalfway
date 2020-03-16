import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class GeocodingService {
  
  

  constructor(private httpclient: HttpClient) {
    
   }

  getGeocode(address: string): Observable<any>{ 
    let params1 = new HttpParams().set('address',address).set('key',environment.googleMaps.apiKey);
    return this.httpclient.get('https://maps.googleapis.com/maps/api/geocode/json',{params:params1})
  }

  async getGeocodeAsync(address: string){
    let params1 = new HttpParams().set('address',address).set('key',environment.googleMaps.apiKey);
    const data = await this.httpclient.get('https://maps.googleapis.com/maps/api/geocode/json',{params:params1}).toPromise();
    return data;
  }
  
  
}
