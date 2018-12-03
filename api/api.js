const   express = require('express'),
        app     = express(),
        http    = require('http').Server(app),
        io      = require('socket.io')(http),
        port    = 3000,
        // Devices
        HS100   = require('./devices/switch/hs100.js'),
        Lifx    = require('./devices/light/lifx.js'),
        // Manage devices
        devices = {},
        createDevice = function(type, settings) {
            switch (type) {
                case 'HS100':
                    return new HS100(settings.host, settings.port);
                case 'Lifx':
                    return new Lifx(settings.host, settings.port);
            }
        }
        ;


io.on('connection', function(socket) {

    socket
    .on('action', async function(data) {
        if (typeof devices[data.deviceId] !== 'undefined') {
            // Device
            let device = devices[data.deviceId]['device'];

            if (typeof device.actions[data.name] !== 'undefined') {
                let state = await device.actions[data.name](data.options);
                
                if (!state) {
                    return;
                }

                socket.emit('state', {
                    state: state
                });
            }
        }
    })
    .on('device', async function(data) {
        if (
            typeof devices[data.deviceId] === 'undefined'
            || JSON.stringify(devices[data.deviceId].settings) !== JSON.stringify(data.settings)
        ) {
            devices[data.deviceId] = {
                device: createDevice(data.type, data.settings),
                settings: data.settings
            };
        }

        let device = devices[data.deviceId]['device'];

        if (typeof device.actions['getState'] !== 'undefined') {
            let state = await device.actions['getState']();
            
            socket.emit('state', {
                state: state
            });
        }
    });

});

http.listen(port, () => {
    console.log(`API server started at localhost:${port}`)
})
;