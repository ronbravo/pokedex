import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-pkd-my-account-ang8',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Pokedex: My Account Angular 8';

  ngAfterViewInit() {
    // TODO: Probably place this in a service...
    // Get a references to the host app. Also have
    // host app cache events if main app hasn't loaded
    // yet. TEMP for now is to delay.
    setTimeout (() => {
      const hostApp = window['__hostapp__'];
      if (hostApp) {
        const listener = hostApp.getMainAppListener ();
        if (listener) {
          listener.emit ('main.app.ready', {
            title: this.title,
            id: 'ronbravo-pkd-my-account-ang8',
          });
        }
      }
    }, 1000);
  }
}
