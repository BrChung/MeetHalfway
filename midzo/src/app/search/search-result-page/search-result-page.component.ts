import { Component, OnInit } from '@angular/core';
import { Observable , BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GeofirexService } from '../../services/geofirex.service';
import * as firebase from 'firebase/app';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-search-result-page',
  templateUrl: './search-result-page.component.html',
  styleUrls: ['./search-result-page.component.scss']
})
export class SearchResultPageComponent implements OnInit {

  points: Observable<any>
  geo: any;
  radius = new BehaviorSubject(7);
  latitude: number;
  longitude: number;

  constructor(private route:ActivatedRoute, private geofirex: GeofirexService) { }

  ngOnInit(): void {
    // this.latitude = Number(this.route.snapshot.params['latitude']); //34.0373
    // this.longitude = Number(this.route.snapshot.params['longitude']); //-117.8785
    this.latitude = Number(this.route.snapshot.queryParamMap.get("lat"))
    this.longitude = Number(this.route.snapshot.queryParamMap.get("lng"))
    this.route.queryParamMap.subscribe(queryParams => {
      this.latitude = Number(queryParams.get("lat"))
      this.longitude = Number(queryParams.get("lng"))
    })
    this.geo = this.geofirex.getGeo();
    const center = this.geo.point(this.latitude, this.longitude);
    const field = 'position'

    //const destinations = firebase.firestore().collection('destinations').where('tags', 'array-contains-any', ['school']);
    const destinations = firebase.firestore().collection('demo-destinations');

    this.points = this.radius.pipe(
      switchMap(r => {
        return this.geo.query(destinations).within(center, r, field);
      })
    )

  }

  update(v){
    this.radius.next(v);
  }

  trackByFn(_, doc){
    return doc.id;
  }

}
