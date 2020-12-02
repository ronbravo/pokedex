import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { ShowPokemonComponent } from './component/show-pokemon/show-pokemon.component';
import { ShowListComponent } from './component/show-list/show-list.component';

@NgModule({
  declarations: [
    AppComponent,
    EmptyRouteComponent,
    ShowPokemonComponent,
    ShowListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
