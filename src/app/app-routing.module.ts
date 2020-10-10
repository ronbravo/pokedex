import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EdsBasicLayoutComponent } from './component/eds/layout/eds-basic-layout/eds-basic-layout.component';
import { UiBasicLayoutComponent } from './component/uikit/layout/ui-basic-layout/ui-basic-layout.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';

// { path: 'first-component', component: FirstComponent },
// { path: 'second-component', component: SecondComponent },

const routes: Routes = [
  // { path: 'eds', component: EdsBasicLayoutComponent },
  // { path: 'uikit', component: UiBasicLayoutComponent },
  // { path: '**', component: EmptyRouteComponent },
  { path: '**', component: EdsBasicLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
})
export class AppRoutingModule { }
