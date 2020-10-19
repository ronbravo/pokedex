import { Component, ElementRef, ViewEncapsulation, ɵConsole } from '@angular/core';
import mitt from 'mitt'

@Component({
  selector: 'app-pkd-main-ang8',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { class: 'host-app-pkd-main-ang8' },
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'Pokedex: Main Angular 8';
  menus = [
    { icon: 'home', label: 'Home', url: '/' },
  ];
  listener = mitt();

  constructor(
    private nativeRef: ElementRef
  ) {
    // TODO: Probably place this in a service...
    // Get a references to the host app.
    const hostApp = window['__hostapp__'];
    if (hostApp) {
      const main = hostApp.setMainAppAsReady({ app: this, listener: this.listener });

      // Pull out the menu from each of the apps.
      const list = [];
      main.apps.forEach ((item) => {
        list.push (item.menu);
      });

      // Update the menus.
      this.menus = this.menus.concat(list);
    }

    // Add event listeners.
    this.listener.on ('main.app.ready', ({ id }) => {
      const parent = document.querySelector ('#mico-app-mount-area');
      if (parent) {
        id = 'ronbravo-pkd-my-account-ang8';
        const dom = document.querySelector (`#${id}`);
        parent.appendChild(dom);
        console.log ('data:', id);
      }
    });
  }
}
