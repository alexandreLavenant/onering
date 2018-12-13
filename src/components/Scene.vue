<template>
	<v-layout id="container" align-end justify-end row fill-height> 
		<v-flex md3>
			<v-card>
				<div id="sceneContainer"></div>
				<v-card-actions>
					<v-btn icon @click="resetPosition">
						<v-icon>gps_fixed</v-icon>
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn icon @click="lockedPosition = !lockedPosition">
						<v-icon>{{ this.lockedPosition ? 'lock' : 'lock_open' }}</v-icon>
					</v-btn>
					<v-spacer></v-spacer>
					<v-btn icon @click="this.fullScreen">
						<v-icon>{{ this.isfullScreen ? 'fullscreen_exit' : 'fullscreen' }}</v-icon>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
const THREE = require('three'),
		OrbitControls = require( 'three-orbit-controls' )(THREE)
		;

export default {
	name: 'Scene',
	data() {
		return {
			sceneContainer: null,
			scene: null,
			camera: null,
			smartphone: null,
			raycaster: null,
			objects: [],
			INTERSECTED: {
				object: null,
				color: null
			},
			renderer: null,
			smartphonePosition: null,
			smartphoneOrientationOffset: { x:0, y:0, z:0 },
			lockedPosition: false,
			isfullScreen: false
		};
	},
	mounted() {
		this.init();
		this.animate();

		if (window.DeviceOrientationEvent) {
    		window.addEventListener('deviceorientation', this.handleOrientiation, true);
		}

		if ("geolocation" in navigator) {
		    // navigator.geolocation.watchPosition(this.handlePosition);
		}
	},
	methods: {
		fullScreen: function() {
			let container = document.getElementById('container');

			if (this.isfullScreen) {
				container.classList.remove('align-center', 'justify-center');
				container.classList.add('align-end', 'justify-end', 'row');

				this.isfullScreen = false;

				return;
			}

			container.classList.remove('align-end', 'justify-end', 'row');
			container.classList.add('align-center', 'justify-center');
			
			this.isfullScreen = true;
			// let contentContainer = document.querySelector('.container'),
			// 	sizeContentContainer = contentContainer.getBoundingClientRect()
			// 	;
			
			// this.renderer.setSize( sizeContentContainer.width, sizeContentContainer.height );
		},
		resetPosition: function() {
			this.smartphone.position.set( 0, 0, 1 );
			
			let offset		= this.smartphoneOrientationOffset,
				orientation = this.smartphone.rotation
				;

			this.smartphoneOrientationOffset = {
				x: offset.x - orientation.x,
				y: offset.y - orientation.y,
				z: offset.z - orientation.z
			};
		},
		init: function() {
			this.sceneContainer = document.getElementById('sceneContainer');
			let sizeContainer = this.sceneContainer.getBoundingClientRect();

			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color( 0xf0f0f0 );

			// Lights
			this.scene.add( new THREE.AmbientLight( 0x505050 ) );

			var gridHelper = new THREE.GridHelper( 20, 30 );
			gridHelper.geometry.rotateX( Math.PI / 2 );
			this.scene.add( gridHelper );
			this.scene.add(new THREE.AxesHelper(10));

			// Camera
			// this.camera = new THREE.PerspectiveCamera( 36, 1, 0.25, 16 );
			this.camera = new THREE.PerspectiveCamera( 45, sizeContainer.width / sizeContainer.height, 0.25, 16 );
			this.camera.position.set( 0, 0 , 7 );

			// Smartphone
			this.smartphone = new THREE.Mesh( new THREE.BoxGeometry( 0.2, 0.5, 0.1 ), new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
			// this.smartphone = new THREE.Mesh( new THREE.BoxGeometry( 0.2, 0.2, 0.2 ), new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
			this.smartphone.name = 'smartphone';
			this.smartphone.position.set( 0, 0, 1 );
			this.smartphone.add(THREE.AxisHelper());
			this.scene.add(this.smartphone);
			
			// TV
			var tv = new THREE.Mesh( new THREE.BoxGeometry( 0.76, 0.03, 0.46 ), new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
			tv.name = 'tv';
			tv.position.set( 0, 2.1, 1);
			tv.plugin = 'hs100';
			this.scene.add(tv);
			this.objects.push(tv);
			
			// Light
			var light = new THREE.Mesh( new THREE.BoxGeometry( 0.8, 0.8, 0.02 ), new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
			light.name = 'light';
			light.position.set( 0, 0, 2 );
			light.plugin = 'lifx';
			this.scene.add(light);
			this.objects.push(light);

			// Raycaster
			this.raycaster = new THREE.Raycaster(this.smartphone.position, new THREE.Vector3(0, 1, 0));

			// Renderer
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.shadowMap.enabled = true;
			this.renderer.setPixelRatio( window.devicePixelRatio );
			// this.renderer.setSize( 200, 200 );
			this.renderer.setSize( sizeContainer.width, sizeContainer.height );
			// this.renderer.setSize( window.innerWidth, window.innerHeight );
			window.addEventListener( 'resize', this.onWindowResize, false );
			// document.body.appendChild( this.renderer.domElement );
			this.sceneContainer.appendChild(this.renderer.domElement)
			
			// Controls
			var controls = new OrbitControls( this.camera, this.renderer.domElement );
			controls.update();
		},
		animate: function()
		{
			requestAnimationFrame( this.animate );
			// Intersect objects
			var intersects = this.raycaster.intersectObjects( this.objects );
			// An object is pointed
			if ( intersects.length > 0  && this.INTERSECTED.object === null ) {
				var intersect = intersects[0];
				this.INTERSECTED.object = intersect.object;
				this.INTERSECTED.color = intersect.object.material.emissive.getHex();
				intersect.object.material.emissive.set( 0xff0000 );
				// Object has a plugin attached to
				if (intersect.object.plugin) {
					// Send devicePointed event
					this.$parent.$emit('devicePointed', {
						deviceId: intersect.object.id,
						name: intersect.object.name,
						plugin: intersect.object.plugin
					});
				}
			}

			// No object pointed
			if ( intersects.length === 0 && this.INTERSECTED.object !== null ) {
				this.INTERSECTED.object.material.emissive.setHex(this.INTERSECTED.color);
				this.INTERSECTED.object = null;
				this.INTERSECTED.color = null;
				// Send devicePointed event
				this.$parent.$emit('devicePointed', {
					deviceId: null,
					plugin: 'nothing'
				});
			}

			this.renderer.render( this.scene, this.camera );
		},
		onWindowResize: function()
		{
			// this.camera.aspect = window.innerWidth / window.innerHeight;
			// this.camera.updateProjectionMatrix();

			let sizeContainer = this.sceneContainer.getBoundingClientRect();
			this.renderer.setSize( sizeContainer.width, sizeContainer.height );
		},
		handleOrientiation: function(orientation)
		{
			if (this.lockedPosition) {
				return;
			}

			var x = orientation.beta,
				y = orientation.gamma,
				z = orientation.alpha,
				offset = this.smartphoneOrientationOffset
				;

			this.smartphone.rotation.set(x * Math.PI / 180 + offset.x, y * Math.PI / 180 + offset.y, z * Math.PI / 180 + offset.z);
			this.raycaster.set( this.smartphone.position, new THREE.Vector3( 0, 1, 0 ).applyQuaternion( this.smartphone.quaternion ));
		},
		handlePosition: function(position)
		{
			if (this.lockedPosition) {
				return;
			}

			var latitude = position.coords.latitude,
				longitude = position.coords.longitude,
				altitude = position.coords.altitude || 1
				;

			if (this.smartphonePosition === null) {
				let coord = this.gpsToCoord(latitude, longitude);

				this.smartphonePosition = {
					x: coord.x,
					y: coord.y,
					z: altitude,
				}
			}

			let currentCoord = this.gpsToCoord(latitude, longitude),
				newX = currentCoord.x - this.smartphonePosition.x,
				newY = currentCoord.y - this.smartphonePosition.y
				;
			
			this.smartphone.position.set(newX, newY, altitude);
			this.raycaster.set( this.smartphone.position, new THREE.Vector3( 0, 1, 0 ).applyQuaternion( this.smartphone.quaternion ));
		},
		gpsToCoord: function(latitude, longitude)
		{
			let earthR = 6371000,
				x = 111.111 * latitude,
				y = 111.111 * longitude
				;

			return {x: x, y: y};
		}
	}
}
</script>

<style lang="css">
	#sceneContainer {
		width: auto;
		height: 250px;
	}
</style>
