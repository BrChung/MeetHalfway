import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddDestinationPageComponent } from "./add-destination-page/add-destination-page.component";
import { ViewDestinationComponent } from "./view-destination/view-destination.component";
import { EditDestinationComponent } from "./edit-destination/edit-destination.component";

const routes: Routes = [
  { path: "add", component: AddDestinationPageComponent },
  { path: ":destID", component: ViewDestinationComponent },
  { path: "edit/:destID", component: EditDestinationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DestinationRoutingModule {}
