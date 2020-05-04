import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomePageComponent } from "./home-page/home-page.component";
import { ReviewsComponent } from "./reviews/reviews.component";

const routes: Routes = [
  // { path: '', component: HomePageComponent },
  {
    path: "login",
    loadChildren: () => import("./user/user.module").then((m) => m.UserModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./search/search.module").then((m) => m.SearchModule),
  },
  {
    path: "dest",
    loadChildren: () =>
      import("./destination/destination.module").then(
        (m) => m.DestinationModule
      ),
  },
  { path: "review", component: ReviewsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
