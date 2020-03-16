import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'login', loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
