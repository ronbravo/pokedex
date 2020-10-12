const state = {}

export class HostApp {
  static setup () {
    state.hostApp = window.getHostApp();
  }

  static show () {
    let { hostApp } = state;
    if (hostApp) {
      hostApp.hideLoader ();
    }
  }
}
