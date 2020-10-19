import { loadMicroApp, registerMicroApps, start } from 'qiankun';

// Store ref objects of the main app.
const main = {
  apps: [],
};

// Bare bones HostApp to load and mount
// the other apps.
class HostApp {
  static async getConfig () {
    return fetch('https://pokeapi.co/api/v2/ability/4')
      .then(res => res.json ())
      .then((json) => {

        // NOTE: Return temporary data...
        return {
          main: {
            name: '@ronbravo/pkd-base-ang8',
            entry: '//localhost:5001',
            container: '#host-main-app-mount',
            props: {
              slogan: 'Hello Qiankun'
            },
          },
          apps: [
            {
              name: '@ronbravo/pkd-my-account-ang8',
              entry: '//localhost:5002',
              menu: { icon: 'account_circle', label: 'ABC My Account', url: '/account' },
              // entry: { scripts: ['//localhost:7100/main.js'] },
              // container: '#ronbravo-pkd-my-account-ang8',
              // activeRule: '/account',
            },
            // {
            //   name: '@ronbravo/pkd-pokemon-inspector-ang8',
            //   entry: '//localhost:5003',
            //   menu: { icon: 'pets', label: 'Pokemon', url: '/pokemon' },
            //   // entry: { scripts: ['//localhost:7100/main.js'] },
            //   // container: '#ronbravo-pkd-my-account-ang8',
            //   // activeRule: '/pokemon',
            // },
          ]
        };
      });
  }

  static setMainAppAsReady ({ app, listener }) {
    main.app = app;
    main.listener = listener;
    console.log ('Main app has been set');
    return main;
  }

  static getMainAppListener () {
    return main.listener;
  }

  static async start () {
    const config = await HostApp.getConfig();

    // Load the main app.
    loadMicroApp(config.main);

    // Go through each micro app and create a pre
    // mount point for it in the ui.
    const parent = document.querySelector('#host-micro-app-pre-mount');

    config.apps.forEach((item) => {
      // Create mount point.
      const div = document.createElement('div');
      const id = item.name.replace('@', '').replace('/', '-');
      div.id = id;
      parent.appendChild(div);

      // Register the app.
      item.container = `#${id}`;        // pre mount dom.
      item.activeRule = item.menu.url   // Set when the app shows.
      main.apps.push(item);
    });

    // Register the micro apps.
    registerMicroApps (main.apps);

    // Start Single SPA.
    start();
  }
}

window.__hostapp__ = HostApp;
HostApp.start ();
