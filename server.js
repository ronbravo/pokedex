const liveServer = require ('live-server');
const pkg = require ('./package.json');
const fs = require ('fs-extra');
const JSON5 = require ('json5');
const { resolve } = require ('path');
const proxy = require ('redbird') ({ port: 80, bunyan: { level: 50 } });


const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 64169 })

wss.on('connection', ws => {
 ws.on('message', message => {
   console.log(`Received message => ${message}`)
 })
 // ws.send('Hello! Message From Server!!')
})

class Server {
  static async start ({ state }) {
    let config;

    try {
      // Get the reverse proxy configurations.
      config = await fs.readFile ('./config.json5');
      config = JSON5.parse (config);

      // Route to any global ip
      Object.keys (config.proxy.domains).forEach ((key) => {
        let item;
        item = config.proxy.domains [key];
        proxy.register (key, item);
        console.log (`- PROXY: ${key} --> ${item}`);
      });

      // start the server.
      await fs.ensureDir (resolve('.', 'dist'));

      process.chdir (resolve ('.', 'dist'));
      state.port = config.port;
      state.root = '.';
      state.file = 'index.html';
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
