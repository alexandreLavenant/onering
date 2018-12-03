<template>
    <div id="device">
        <settings v-bind:deviceId="deviceId" v-bind:deviceType="type"></settings>
        <v-layout column align-center justify-center fill-height>
            <v-flex md12>
                <h1>{{ this.name }}</h1>
                <v-btn :color="this.state.power ? 'success' : 'error'" fab large dark @click="this.switch">
                    <v-icon>power_settings_new</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import Settings from '../Settings.vue';

export default {
    name: 'hs100',
    props: {
        deviceId : Number
    },
    data() {
        return {
            name: 'TPLink switch',
            type: 'HS100',
            state: {
                power: false
            }
        }
    },
    created() {
        this.$on('deviceName', (name) => {
            this.name = name;
        });
    },
    methods: {
        switch() {
            this.$socket.emit('action', {
                deviceId: this.deviceId,
                name: 'switch'
            })
        }
    },
    sockets: {
        state: function (data) {
            this.state = data.state;
        }
    },
    components: {
		'settings': Settings
	}
}
</script>