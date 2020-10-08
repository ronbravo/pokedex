# App Base Angular8

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20. It was built for the [Pokedex](https://github.com/ronbravo/pokedex) micro app repo but in theory can be used as a boilerplate for any [qiankun](https://qiankun.umijs.org/) or [single-spa](https://single-spa.js.org/) compatible project.

## Qiankun and Single Spa Framework

* **ZoneJs**
  * Angular has a dependency on the ZoneJs library. Since the library mounts itself to the global window space, it is recommended that you exclude it in the webpack build and load it into the host / master app.
    * [Multiple versions of Zone JS and Angular for different child applications](https://github.com/single-spa/single-spa-angular/issues/4)
    * [Sample Single Spa Index File](https://github.com/single-spa/single-spa-angular/blob/60b88f90d90a6bcbe7e1d1e751c521c48e39f705/README.md#check-if-it-works)
* For angular 8, make sure to use `webpack-merge` version `4.2.2` as per [this post](https://github.com/netlify/netlify-lambda/issues/249#issuecomment-660559206).

### Files to update

Qiankun uses the Single SPA Framework and so it requires a few files to be updated. Also included in this list are files to be modified to allow for a better development experience. **NOTE:** Runing the command `npm setup` should configure the needed files and name everything properly based on the `config.json5` file.

* `src/index.html` - Add a reference to load [zone.js](https://cdnjs.com/libraries/zone.js/0.9.1) in the head tag. Also update the mounting tag to use something specific to the app. For example: `<app-pkg-catalog-ang8></app-pkg-catalog-ang8>`
* `src/app/empty-route/` - Add this for Single SPA.
* `src/app/single-spa/` - Helps with asset routing and system props sharing.
* `src/app-routing.module.ts` - Add the [APP_BASE_HREF](https://single-spa.js.org/docs/ecosystem-angular/#routing) setup to prevent micro app routing errors.
* `src/app.module.ts` - Include the `EmptyRouteComponent` as a declaration.
* `src/app.component.ts` - Update the tag selector for the component mount point to something specific to the app. For example `app-pkg-catalog-ang8`.
* `src/main.ts` - Update to include the Single SPA classes for booting up the app. Update the tag selector for the component mount point to something specific to the app. For example `app-pkg-catalog-ang8`.
* `extra-webpack.config.js` - Settings for the custom Single SPA build.
* `angular.json` - Update to include the custom webpack build settings.
* `package.json` - Update to npm scripts for adding a `dev` and modifying `build`.
* `dev-server.js` - A dev server intended to run on the built `/dist` file of the project and is an alternative to the webpack dev server Angular runs.

### TODO:

* Update the `dev-server.js` to be able to use webpack dev server like proxy format.

```
{
  "/user-api": {
    "target": "http://localhost:12345",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/user-api": "/v1"
    }
  },
  ...
}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
