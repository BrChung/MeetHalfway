import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DestinationRoutingModule } from "./destination-routing.module";
import { AddDestinationPageComponent } from "./add-destination-page/add-destination-page.component";
import { SharedModule } from "../shared/shared.module";

import { ReactiveFormsModule } from "@angular/forms";

import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

@NgModule({
  declarations: [AddDestinationPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    DestinationRoutingModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    BsDropdownModule,
  ],
})
export class DestinationModule {}
