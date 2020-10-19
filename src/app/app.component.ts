import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-pkd-main-ang8',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { class: 'host-app-pkd-main-ang8' },
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'Pokedex: Main Angular 8';
}
