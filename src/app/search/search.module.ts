import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgmCoreModule } from "@agm/core";

import { SearchRoutingModule } from "./search-routing.module";
import { SearchPageComponent } from "./search-page/search-page.component";
import { SearchResultPageComponent } from "./search-result-page/search-result-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { MaterialElevationDirective } from "./material-elevation.directive";

@NgModule({
  declarations: [
    SearchPageComponent,
    SearchResultPageComponent,
    MaterialElevationDirective,
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    AgmCoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class SearchModule {}
