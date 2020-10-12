import mod from '$root/package.json';
import Vue from 'vue/dist/vue.js';
import App from '/component/simple/app/App.vue';
import { HostApp } from '/parcel/host-app/HostApp';

// Render the app to the page.
const render = () => {
  const vm = new Vue ({
    el: '#app',
    template: '<App/>',
    components: { App },
  });
  return Promise.resolve ();
}

// Hook the app into the micro frontend qiankun host.
(global => {
  global [mod.name] = {
    bootstrap: () => {
      console.log (`- bootstrap: ${mod.name}`);
      HostApp.setup ();
      return Promise.resolve ();
    },
    mount: () => {
      console.log (`- mount: ${mod.name}`);
      HostApp.show ();
      return render ();
    },
    unmount: () => {
      console.log (`- unmount: ${mod.name}`);
      return Promise.resolve ();
    },
  };
}) (window);

// Render the app if qiankun is not detected.
if (!window.__POWERED_BY_QIANKUN__) {
  render ();
}
