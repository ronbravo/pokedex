const liveServer = require("live-server");

const options = {
    port: 5000,
    cors: true,
    open: false,
    root: 'dist',
    file: 'index.html',
    wait: 100,
    logLevel: 2,
};

liveServer.start (options);
