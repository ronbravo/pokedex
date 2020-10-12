const liveServer = require ('live-server');
const pkg = require ('../../../package.json');
const fs = require ('fs-extra');
const { resolve } = require ('path');

class Server {
  static async start ({ state }) {
    let config;

    try {
      // start the server.
      await fs.ensureDir (resolve('.', 'dist'));

      process.chdir (resolve ('.', 'dist'));
      state.port = pkg.config.port;
      state.root = '.';
      // state.file = 'index.html';
      state.watch = ['.'];
      liveServer.start (state);
    }
    catch (err) {
      console.error (err);
    }
  }
}

Server.start ({
  state: {
    cors: true,
    open: false,
    logLevel: 2,
  }
});
