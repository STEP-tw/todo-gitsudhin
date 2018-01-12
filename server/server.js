const http = require('http');

const app=require('../todoApp.js');
const PORT = 9000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
