'use strict';
var fork = require('child_process').fork;
var osCPUsLength = require('os').cpus().length;

var Loader = {};
var port = 8000;

Loader.start = function() {
    for(var i = 0; i < osCPUsLength; i++) {
        var worker = fork('app.js', ['--port', port+i]);
        addWorkerEvent(worker);
    }
}

function addWorkerEvent(worker) {
    worker.on('message', function(msg) {
        if(typeof msg != 'object' || !msg.message) {
            console.log('err');
            return;
        }
        console.log(msg.message);
        console.log(msg.proId);
        switch(msg.message) {
            case 'restart': 
                console.log('restart');
                break;
            case 'stop': 
                console.log(msg.proId);
                process.kill(msg.proId);
                break;
        }
    })
}

module.exports = Loader;