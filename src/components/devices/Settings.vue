<template>
    <v-layout align-start justify-end row fill-height>
        <v-flex md1>
            <v-dialog v-model="settingsDialog" max-width="600px">
                <v-icon slot="activator">build</v-icon>
                <v-card>
                    <v-card-title>
                        <span class="headline">Device Settings</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                            <v-text-field v-model="settings.name" label="Device Name*" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                            <v-text-field v-model="settings.host" label="Host*" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                            <v-text-field v-model="settings.port" label="Port"></v-text-field>
                            </v-flex>
                        </v-layout>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="settingsDialog = false">Close</v-btn>
                        <v-btn color="green darken-1" flat @click="save">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    name: 'config',
    props: {
        deviceId: Number,
        deviceType: String
    },
    data() {
        return {
            settings: {},
            settingsDialog: false
        }
    },
    created() {
        this.init();
    },
    activated() {
        this.init();
    },
    methods: {
        init() {
            let deviceSettings = this.$localStorage.get(this.deviceId);
            // No device settings found in local storage
            if (deviceSettings === null) {
                // this.settingsDialog = true;
                return;
            }

            deviceSettings = JSON.parse(deviceSettings);
            // Send name stored to parent
            this.$parent.$emit('deviceName', deviceSettings.name);
            // Create the device with the right settings
            this.$socket.emit('device', {
                deviceId: this.deviceId,
                type: this.deviceType,
                settings: deviceSettings
            });

            // Init form model
            this.settings = deviceSettings;
        },
        save() {
            // Send name to parent
            this.$parent.$emit('deviceName', this.settings.name);
            // Save the settings in local storage
            this.$localStorage.set(this.deviceId.toString(), JSON.stringify(this.settings));
            // Create the device with the right settings
            this.$socket.emit('device', {
                deviceId: this.deviceId,
                type: this.deviceType,
                settings: this.settings
            });
            // Close settings modal
            this.settingsDialog = false;
        }
    }
}
</script>