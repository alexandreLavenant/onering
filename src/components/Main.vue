<template>
	<div id="main">
		<component v-bind:is="currentDeviceComponent" v-bind:deviceId="deviceId"></component>
		<scene></scene>
	</div>
</template>

<script>
import Scene from '@/components/Scene'
import Nothing from '@/components/devices/Nothing'
import HS100 from '@/components/devices/switch/HS100'
import Lifx from '@/components/devices/light/Lifx'

export default {
	name: 'Main',
	data() {
		return {
			deviceId: null,
			currentDeviceComponent: 'nothing'
		}
	},
	created() {
		this.$on('devicePointed', function(devicePointed) {
			this.deviceId = devicePointed.deviceId;
      		this.currentDeviceComponent = devicePointed.plugin;
   		});
	},
	components: {
		'scene': Scene,
		'nothing': Nothing,
		'hs100': HS100,
		'lifx': Lifx
	}
}
</script>