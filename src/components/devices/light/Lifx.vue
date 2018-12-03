<template>
    <div id="device">
        <settings v-bind:deviceId="deviceId" v-bind:deviceType="type"></settings>
        <v-layout column align-center justify-center fill-height>
            <v-flex md12>
                <h1>{{ this.name }}</h1>
            </v-flex>
            <v-flex md12>
                <h3>Power</h3>
                <v-btn :color="this.state.power ? colors.hex : 'error'" fab large dark @click="this.switch">
                    <v-icon>wb_incandescent</v-icon>
                </v-btn>
            </v-flex>
            <v-flex md12>
                <h3>Color picker</h3>
                <color-picker v-model="colors"></color-picker>
            </v-flex>
            <v-flex md12>
                <v-slider v-model="state.color.kelvin" label="Kelvin" min="2500" max="9000"></v-slider>
                <h3>{{ this.state.color.kelvin }}</h3>
                <v-btn color="primary" fab large dark @click="this.setColors">
                    <v-icon>done</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import Settings from '../Settings.vue';
import { Chrome } from 'vue-color';

let watchTimeout = null;

export default {
    name: 'lifx',
    props: {
        deviceId : Number
    },
    data() {
        return {
            name: 'Lifx Light',
            type: 'Lifx',
            state: {
                color: {
                    kelvin: 0
                },
                power: 0
            },
            colors: {}
        }
    },
    created() {
        this.$on('deviceName', (name) => {
            this.name = name;
        });
    },
    // watch: {
    //     colors: function() {
    //         let self = this;

    //         clearTimeout(watchTimeout);
    //         watchTimeout = setTimeout(function() {
    //             self.setColors();
    //         }, 5e2);
    //     }
    // },
    methods: {
        switch() {
            this.state.power = !this.state.power;

            this.$socket.emit('action', {
                deviceId: this.deviceId,
                name: 'switch',
                options: { state : this.state.power }
            })
        },
        setColors() {
            let colors = this.colors;

            this.$socket.emit('action', {
                deviceId: this.deviceId,
                name: 'setColors',
                options: {
                    h: colors.hsl.h,
                    s: colors.hsl.s * 100,
                    l: colors.hsl.l * 100,
                    k: this.state.color.kelvin
                }
            });
        }
    },
    sockets: {
        state: function (data) {
            this.state = data.state;

            this.colors = {
                h: data.state.color.hue,
                s: data.state.color.saturation,
                l: data.state.color.brightness
            }
        },
    },
    components: {
        'settings': Settings,
        'color-picker': Chrome
	}
}
</script>