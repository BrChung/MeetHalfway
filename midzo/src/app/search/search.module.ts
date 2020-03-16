import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core'

import { SearchRoutingModule } from './search-routing.module';
import { SearchPageComponent } from './search-page/search-page.component';
import { SearchResultPageComponent } from './search-result-page/search-result-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


import { environment } from '../../environments/environment';


@NgModule({
  declarations: [SearchPageComponent, SearchResultPageComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    AgmCoreModule.forRoot(environment.googleMaps),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SearchModule { }
