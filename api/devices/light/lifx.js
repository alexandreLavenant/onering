'use strict';

const   Device      = require('../device.js'),
		LifxClient	= require('node-lifx').Client
		;
class LIFX extends Device
{
    constructor(host, port) {
        super(host, port);

        var self = this;
        this.actions = {
            switch: async function(options) {
                if (options.state) {
                    self.connection.light(self.host).on();
                } else {
                    self.connection.light(self.host).off();
                }

                return false;
            },
            setColors: async function(options) {
                let light = self.connection.light(self.host);

                if (!light) {
                    return false;
                }

                return new Promise((resolve, reject) => {
                    light.color(options.h, options.s, options.l, options.k, 2e3, (err) => {
                        if (err) {
                            console.error(err);
                        }

                        resolve(false);
                    });
                });
            },
            getState: async function() {
                let light = self.connection.light(self.host);

                if (!light) {
                    return false;
                }

                return new Promise((resolve, reject) => {
                    light.getState((err, lightState) => {
                        if (err) {
                            console.error(err);
                        }

                        resolve(lightState);
                    });
                })
            }
        };
    }

    connect() {
        this.connection = new LifxClient();
        this.connection.init({
            lights: [this.host]
        });
    }
}

module.exports = LIFX;
