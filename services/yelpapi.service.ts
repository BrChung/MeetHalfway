import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class YelpapiService {

  constructor(private httpclient: HttpClient) { }


  sendHttpRequest() {
    return this.http.get<JSON>(this.configUrl, {
      headers
    }); //{params:params1, headers:headers1}

  getYelpInfo(search:string): Observable<any> {
    let params1 = new HttpParams().set('term',"Coffee").set('latitude',33.882695).set('longitude',-117.886819)
    let headers1 = new HttpHeaders().set("Authorization", "Bearer MyApiKey"); //what we need
  }
} //console.log is the print command print!

/*'use strict';
 
const yelp = require('yelp-fusion');
const apikey = 'vMTn4TIB6o8LdEEnk59poQ4QrJ2pgR86iN3gq5K0p734NWcJ1aM_4hCC0wsH5k2IeVwOVpRgxF50LoLqDbCBdkWsuNo8d4CkyzDII4fvxmcwXf8F3_0jIj'
const client = yelp.client(apikey);
 
client.search({
  term: 'Four Barrel Coffee',
  location: 'san francisco, ca',
}).then(response => {
  console.log(response.jsonBody.businesses[0].name);
}).catch(e => {
  console.log(e);
});*/