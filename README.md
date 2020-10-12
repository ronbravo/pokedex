# Pokedex: My Account Vue2

The Pokedex main micro app used to manage the loading, mounting, and un-mounting of other micro apps.

## Vue and PracelJs

* Seperation of Concerns - separate files (html, js, and less / css).
  * [Github Issue](https://github.com/parcel-bundler/parcel/issues/1333)
  * [Temp Solution](https://gist.github.com/Neefay/666fbb9feda207c74cbf395f77326a04)

## Resources

* [ParcelJs Static Files Copy](https://github.com/elwin013/parcel-plugin-static-files-copy)
* [Parcel VueJs Hello World](https://github.com/parcel-bundler/parcel/issues/2038#issuecomment-431303208)
* [Awesome Javascript](https://github.com/sorrycc/awesome-javascript)
* [Ant Design](https://ant.design/docs/spec/introduce)
* [Disabe Parcel's Cache](https://github.com/parcel-bundler/parcel/issues/1806) - Parcel's cache can cause problems at times, it is best to just disable it for now.

### VueJs, ParcelJs, and Seperation of concerns

Currently there is an issue with the Parcel bundler where it does not know how to handle `.vue` files where the concerns (html, js, style) have been broken out into separate files. Below is a set of temporary solutions to fix the problem until the Parcel bundler can handle it.

####
  * [Vue Seperation of Concerns](https://vuejs.org/v2/guide/single-file-components.html#What-About-Separation-of-Concerns)
  * [Github Issue](https://github.com/parcel-bundler/parcel/issues/1333)
  * [Temporary Solution 1](https://github.com/parcel-bundler/parcel/issues/1333#issuecomment-406284260)
  * [Temporary Solution 2](https://gist.github.com/Neefay/666fbb9feda207c74cbf395f77326a04)
  * [Pug HTML Templating](https://pugjs.org/language/iteration.html)
