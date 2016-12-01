'use strict';

exports.module = new Logger();

var prettyjson = require('prettyjson');

function Logger() {
}

Logger.prototype.print = function(message, data) {
    if (typeof message === 'string') {
        console.log(message);
    } else {
        console.log(prettyjson.render(message));
    }

    if (data) {
        console.log(prettyjson.render(data));
    }
};
