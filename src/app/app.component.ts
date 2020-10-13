import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-pkd-app-base-ang5',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  host: { id: 'app-pkd-app-base-ang5', class: 'micro-app' },
})
export class AppComponent implements AfterViewInit {
  title = 'Pokedex: App Base Angular 5';

  ngAfterViewInit() {
    // Add this for when running the app by itself.
    if (!(window as any).__POWERED_BY_QIANKUN__) {
      document.body.classList.add ('ready');
    }
  }
}
