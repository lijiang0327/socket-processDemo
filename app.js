'use strict';
var http = require('http');
var express = require('express');
var fs = require('fs');
var path = require('path');
var nconf = require('nconf');
var daemon = require('daemon');
var SocketIo = require('socket.io');
var socketioWildcard = require('socketio-wildcard');

var app = express();
var server = http.createServer(app);
var port;
var io = new SocketIo();
var socketIo = {};

// io.use(socketioWildcard);
nconf.argv().env().file(path.join(__dirname, 'config.json'));
port = nconf.get('port') || 8000;
// daemon();
app.set('views', path.join(__dirname,'public/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/public',express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render('index.html');
});
io.on('connection', onConnection);

io.listen(server);
server.listen(port);

function onConnection(socket) {
    socketIo = socket;
    socketInit();
    console.log('connected');
}
function socketInit() {
    socketIo.on('message', function(msg) {
        if(typeof msg != 'object' || !msg.message) {
            console.log('err');
            return;
        }
        switch(msg.message) {
            case 'restart': 
                process.send({message: 'restart', proId: process.pid})
                break;
            case 'stop': 
                process.send({message: 'stop', proId: process.pid});
                break;
            default: 
                console.log('default');
                break;
        }
    })
}