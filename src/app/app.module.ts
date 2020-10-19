import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { ProfileComponent } from './component/profile/profile.component';
import { BillingComponent } from './component/billing/billing.component';

@NgModule({
  declarations: [
    AppComponent,
    EmptyRouteComponent,
    ProfileComponent,
    BillingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
