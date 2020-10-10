import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DynamicModule } from 'ng-dynamic-component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { UiBasicLayoutComponent } from './component/uikit/layout/ui-basic-layout/ui-basic-layout.component';
import { EdsBasicLayoutComponent } from './component/eds/layout/eds-basic-layout/eds-basic-layout.component';

const components: any = [
  EmptyRouteComponent,
  UiBasicLayoutComponent,
  EdsBasicLayoutComponent
];

@NgModule({
  declarations: [
    AppComponent
  ].concat(components),
  imports: [
    BrowserModule,
    AppRoutingModule,
    DynamicModule.withComponents(components)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
