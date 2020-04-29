import { Component, OnInit } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { GeofirexService } from "../../services/geofirex.service";
import * as firebase from "firebase/app";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-search-result-page",
  templateUrl: "./search-result-page.component.html",
  styleUrls: ["./search-result-page.component.scss"],
})
export class SearchResultPageComponent implements OnInit {
  location: Location;
  points: Observable<any>;
  geo: any;
  radius = new BehaviorSubject(7);
  latitude: number;
  longitude: number;
  // curr_lat: number;
  // curr_lng: number;
  previousWindow;
  tags: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private geofirex: GeofirexService
  ) {}

  clickedMarker(infoWindow) {
    if (this.previousWindow) {
      this.previousWindow.close();
    }
    this.previousWindow = infoWindow;
  }

  ngOnInit(): void {
    // Is this code block necessary?
    this.latitude = Number(this.route.snapshot.queryParamMap.get("lat"));
    this.longitude = Number(this.route.snapshot.queryParamMap.get("lng"));
    this.tags = this.route.snapshot.queryParamMap.getAll("tag");
    //
    this.route.queryParamMap.subscribe((queryParams) => {
      this.latitude = Number(queryParams.get("lat"));
      this.longitude = Number(queryParams.get("lng"));
      this.tags = queryParams.getAll("tag");
    });

    this.location = {
      latitude: this.latitude,
      longitude: this.longitude,
      marker: [
        {
          lat: this.latitude,
          lng: this.longitude,
          label: "center",
        },
      ],
    };

    // this.getUserLocation()

    this.geo = this.geofirex.getGeo();
    const center = this.geo.point(this.latitude, this.longitude);
    const field = "position";

    //const destinations = firebase.firestore().collection('destinations').where('tags', 'array-contains-any', ['school']);

    var destinations;

    if (this.tags.length === 0 || this.tags[0] === "null") {
      destinations = firebase.firestore().collection("demo-destinations");
    } else {
      destinations = firebase
        .firestore()
        .collection("demo-destinations")
        .where("category", "array-contains-any", this.tags);
    }

    this.points = this.radius.pipe(
      switchMap((r) => {
        return this.geo.query(destinations).within(center, r, field);
      })
    );
  }

  /* if ever needed to get user's current location */
  // private getUserLocation(){
  //   if(navigator.geolocation){
  //     navigator.geolocation.getCurrentPosition(position => {
  //       this.curr_lat = position.coords.latitude;
  //       this.curr_lng = position.coords.longitude;
  //     })
  //   }
  // }

  update(v) {
    this.radius.next(v);
  }

  trackByFn(_, doc) {
    return doc.id;
  }
}

interface Marker {
  lat: number;
  lng: number;
  label: string;
}

interface Location {
  latitude: number;
  longitude: number;
  marker: Array<Marker>;
}
