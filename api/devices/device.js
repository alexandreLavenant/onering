'use strict';

class Device
{
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.actions = {};
        this.connection;

        this.connect();
    }

    connect() {}
}

module.exports = Device;