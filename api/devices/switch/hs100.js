'use strict';

const   Device = require('../device.js'),
        switchApi       = require('tplink-smarthome-api'),
        switchClient	= new switchApi.Client()
        ;

class HS100 extends Device
{
    constructor(host, port) {
        super(host, port);

        var self = this;
        this.actions = {
            switch: async function() {
                if (!self.connection) {
                    return false;
                }

                return  self.connection.togglePowerState()
                            .then((state) => {
                                return {
                                    power: state
                                };
                            })
                            .catch((e) => {
                                console.error(e);

                                return false;
                            });
            },
            getState: async function() {
                if (!self.connection) {
                    return false;
                }

                return  self.connection.getPowerState()
                        .then((state) => {
                            return {
                                power: state
                            };
                        })
                        .catch((e) => {
                            console.error(e);

                            return {
                                power: false
                            };
                        });
            }
        };
    }

    connect() {
        this.connection = switchClient.getPlug({ host : this.host });
    }
}

module.exports = HS100;