import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DestinationRoutingModule } from "./destination-routing.module";
import { AddDestinationPageComponent } from "./add-destination-page/add-destination-page.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [AddDestinationPageComponent],
  imports: [CommonModule, SharedModule, DestinationRoutingModule],
})
export class DestinationModule {}
