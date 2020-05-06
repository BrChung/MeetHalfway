import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component'
import { SearchResultPageComponent } from './search-result-page/search-result-page.component';


const routes: Routes = [
  { path: '', component: SearchPageComponent},
  { path: 'result', component: SearchResultPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
