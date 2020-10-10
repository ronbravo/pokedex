import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { EdsBasicLayoutComponent } from './component/eds/layout/eds-basic-layout/eds-basic-layout.component';
import { UiBasicLayoutComponent } from './component/uikit/layout/ui-basic-layout/ui-basic-layout.component';
import { HostAppService } from './service/host-app.service';

@Component({
  selector: 'app-pkd-main-ang8',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  host: { 'class': 'app-pkd-main-ang8' },
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {
  component = EdsBasicLayoutComponent;
  // component = UiBasicLayoutComponent;

  title = 'Pokedex Main App in Angular 8';

  constructor(private hostAppService: HostAppService) {}

  ngAfterViewInit () {
    this.hostAppService.hideLoader();
  }
}
