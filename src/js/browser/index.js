import mod from '$root/package.json';
import Vue from 'vue/dist/vue.js';
import App from '/component/simple/app/App.vue';
import { HostAppClient } from '/parcel/host-app-client/HostAppClient';

// Render the app to the page.
const render = () => {
  let id;

  id = HostAppClient.kebabAppName ({ id: mod.name });
  const vm = new Vue ({
    el: `#${id}`,
    template: '<App/>',
    components: { App },
  });
  HostAppClient.show ({ id });
  return Promise.resolve ();
}

// Render the app if qiankun is not detected.
if (window.__POWERED_BY_QIANKUN__) {
  // Hook the app into the micro frontend qiankun host.
  HostAppClient.register ({
    name: mod.name,
    bootstrap: () => {
      return Promise.resolve ();
    },
    mount: () => {
      return render ();
    },
    unmount: () => {
      return Promise.resolve ();
    },
  });
}
else {
  render ();
}
