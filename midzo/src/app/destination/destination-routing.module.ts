import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddDestinationPageComponent } from "./add-destination-page/add-destination-page.component";

const routes: Routes = [{ path: "", component: AddDestinationPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DestinationRoutingModule {}
