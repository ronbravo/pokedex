import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HostAppService {
  hostApp;

  constructor() {
    const getHostApp = window['getHostApp'];
    if (getHostApp) { this.hostApp = getHostApp(); }
  }

  hideLoader() {
    if (this.hostApp) {
      this.hostApp.hideLoader();
    }
  }
}
