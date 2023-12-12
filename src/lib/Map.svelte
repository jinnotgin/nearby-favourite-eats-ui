<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/env';
	import 'leaflet/dist/leaflet.css';

	let map;

	onMount(async () => {
		if (browser) {
			const L = await import('leaflet');

			map = L.map('map').setView([1.3521, 103.8198], 12);

			// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			// 	attribution:
			// 		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			// }).addTo(map);

			const OneMapSG_Grey = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Grey/{z}/{x}/{y}.png', {
				minZoom: 11,
				maxZoom: 18,
				bounds: [
					[1.56073, 104.11475],
					[1.16, 103.502]
				],
				attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
			});
			OneMapSG_Grey.addTo(map);

			/*
        L
				.marker([51.5, -0.09])
				.addTo(map)
				.bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
				.openPopup();
        */
		}
	});

	onDestroy(() => {
		if (map) map.remove();
	});

	export function getCenter() {
		if (map) return map.getCenter();
		else return false;
	}
</script>

<div>
	<div class="center">
		<svg
			xmlns:xlink="http://www.w3.org/1999/xlink"
			class="DCxYpf"
			focusable="false"
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			><path
				d="M7.50302273,-6.81818182e-05 C10.5930227,-6.81818182e-05 13.0052955,2.48720455 13.0052955,5.42720455 C13.0052955,7.76379545 11.8748409,9.12061364 10.7443864,10.4774318 C10.2909773,11.0051591 9.83893182,11.6078864 9.38688636,12.2112955 C8.93484091,12.8140227 8.63347727,13.7187955 8.40711364,14.1708409 C8.18143182,14.6228864 8.03006818,14.9999318 7.50302273,14.9999318 C6.97461364,14.9999318 6.82461364,14.6228864 6.59825,14.1708409 C6.37188636,13.7187955 6.07052273,12.8140227 5.61847727,12.2112955 C5.16575,11.6078864 4.71370455,11.0051591 4.26165909,10.4774318 C3.13120455,9.12061364 2.00006818,7.76379545 2.00006818,5.42720455 C2.00006818,2.48720455 4.41165909,-6.81818182e-05 7.50302273,-6.81818182e-05 Z M7.50302273,1.36356818 C5.22029545,1.36356818 3.36370455,3.18606818 3.36370455,5.42720455 C3.36370455,7.27015909 4.22211364,8.29970455 5.30893182,9.60402273 C5.77734091,10.1508409 6.25120455,10.7822045 6.70938636,11.3931136 C7.04893182,11.8458409 7.30461364,12.3831136 7.50302273,12.8378864 C7.70075,12.3831136 7.95643182,11.8458409 8.29597727,11.3931136 C8.75484091,10.7822045 9.22734091,10.1508409 9.70870455,9.58970455 C10.7825682,8.29970455 11.6416591,7.27015909 11.6416591,5.42720455 C11.6416591,3.18606818 9.78438636,1.36356818 7.50302273,1.36356818 Z M7.50275,4.09793182 C8.23638636,4.09793182 8.83161364,4.69315909 8.83161364,5.42679545 C8.83161364,6.16111364 8.23638636,6.75634091 7.50275,6.75634091 C6.76843182,6.75634091 6.17320455,6.16111364 6.17320455,5.42679545 C6.17320455,4.69315909 6.76843182,4.09793182 7.50275,4.09793182 Z"
				fill="#5F6368"
			/></svg
		>
	</div>
	<div id="map" />
</div>

<style>
	/* @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'; */
	#map {
		height: 80vh;
		display: block;
	}
	:global(div.leaflet-control-attribution) {
		display: flex;
	}
	.center {
		height: 80px;
		width: 80px;
		z-index: 1000;
		position: absolute;
		left: 50%;
		top: 35vh;
		transform: translate(-50%, 20%);
		user-select: none;
		-moz-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-o-user-select: none;
		pointer-events: none;
	}
	.center svg {
		height: 100%;
		width: 100%;
		-webkit-filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
		filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
	}
	.center svg path {
		fill: #ec9550;
	}
</style>
