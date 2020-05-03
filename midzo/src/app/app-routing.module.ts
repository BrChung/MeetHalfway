import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'login', loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'profile', component: ProfilePageComponent 
  },
  {
    //path: 'edit-profile', component: EditProfileComponent 

    path: 'edit-profile/:uid', component: EditProfileComponent 
  }
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
