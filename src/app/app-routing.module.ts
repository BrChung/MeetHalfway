import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomePageComponent } from "./home-page/home-page.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ProfilePageComponent } from "./profile-page/profile-page.component";

const routes: Routes = [
  // { path: '', component: HomePageComponent },
  { path: "profile", component: ProfilePageComponent },
  { path: "edit-profile/:uid", component: EditProfileComponent },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
