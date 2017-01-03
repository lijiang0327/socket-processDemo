'use strict';

var nconf = require('nconf');
module.exports = function() {
    console.log(nconf.get('build'));
    console.log(nconf.get('version'));
}