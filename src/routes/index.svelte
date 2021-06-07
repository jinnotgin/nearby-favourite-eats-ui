<script lang="ts">
	import { onMount } from 'svelte';

	let currentPosition = { coords: { longitude: 0, latitude: 0 } };
	let lastUpdated;
	let venues = {};
	$: venuesCount = Object.keys(venues).length;
	let venuesIdsSortedByDistance = [];
	$: {
		currentPosition;
		venuesIdsSortedByDistance = Object.values(venues)
			.sort(sortFuncs.nearby)
			.map(item => item.id);
		// console.log('sorted based on geolocation');
		// console.log(venuesIdsSortedByDistance);
	}

	const burppleVenusUrl =
		'https://raw.githubusercontent.com/jinnotgin/burpple-wishlist-scraper/main/data/venues.json';

	const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const dayNow = dayMap[new Date().getDay()];

	// geolocation
	const getPosition = options => {
		return new Promise(function(resolve, reject) {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	};

	// dirty function to get opening hours
	const openingHoursToday = textStr => {
		if (!!!textStr.includes(dayNow)) return '';
		return textStr.split(`${dayNow}:`)[1].split('\n')[0];
	};

	// https://jaredtong.com/burpple-beyond/
	// https://github.com/tongrhj/lickilicky/blob/79d12e46aeaf5a404d72c75c68cd48399639d236/index.html#L185-L209
	const sortFuncs = {
		name: function(a, b) {
			if (a.name > b.name) {
				return 1;
			} else if (a.name < b.name) {
				return -1;
			} else {
				return 0;
			}
		},
		price: function(a, b) {
			function extractPrice(formatted_price) {
				var price = (formatted_price && formatted_price.match(/\d/g).join('')) || 0;
				return parseInt(price, 10);
			}
			return extractPrice(a.formatted_price) - extractPrice(b.formatted_price);
		},
		nearby: function(a, b) {
			function haversineDistance(p1, p2) {
				var atan2 = Math.atan2;
				var cos = Math.cos;
				var sin = Math.sin;
				var sqrt = Math.sqrt;
				var PI = Math.PI;
				var R = 6378137; // (mean) radius of Earth (meters)

				function squared(x) {
					return x * x;
				}
				function toRad(x) {
					return (x * PI) / 180.0;
				}
				var aLat = p1.latitude;
				var bLat = p2.latitude;
				var aLng = p1.longitude;
				var bLng = p2.longitude;

				var dLat = toRad(bLat - aLat);
				var dLon = toRad(bLng - aLng);

				var f =
					squared(sin(dLat / 2.0)) + cos(toRad(aLat)) * cos(toRad(bLat)) * squared(sin(dLon / 2.0));
				var c = 2 * atan2(sqrt(f), sqrt(1 - f));

				return R * c;
			}
			var origin = {
				latitude: currentPosition.coords.latitude,
				longitude: currentPosition.coords.longitude
			};
			return haversineDistance(origin, a.location) - haversineDistance(origin, b.location);
		}
	};

	onMount(async () => {
		// TODO: hack to always get new data withotu cache
		const res = await fetch(`${burppleVenusUrl}?${new Date().getTime()}`);
		const resJson = await res.json();

		venues = resJson.data;
		lastUpdated = new Date(resJson.end);

		currentPosition = await getPosition({ timeout: 10000 });
	});

	// TODO: for the google url, consider adjusting the scraper to give the url param directly, rather than manipulating via frontend
	const generateGoogleUrl = venue => {
		const { name = '', details = ' ' } = venue;

		const addressParts = details.split(' ');
		const postal = addressParts[addressParts.length - 1].trim();

		const GOOGLE_MAPS_BASE = 'https://www.google.com/maps/search/?api=1&query=';
		const query = encodeURIComponent(`${name.trim()} ${postal}`);

		return `${GOOGLE_MAPS_BASE}${query}`;
	};
</script>

<style>
	div.images-container {
		display: flex;
		overflow-x: scroll;
	}
	div.images-container::-webkit-scrollbar {
		display: none; /* for Chrome, Safari, and Opera */
	}
	div.images-container img {
		height: 150px;
		margin: 0 4px;
	}
</style>

<svelte:head>
	<title>Nearby Favourite Eats</title>
</svelte:head>

<h1>Nearby Fav Eats</h1>
<h2>Venues: {venuesCount}</h2>
<hr />
{#each venuesIdsSortedByDistance as venueId (venueId)}
	<p>
		<strong>{venues[venueId].name}</strong>
	</p>
	<p>
		<a href={generateGoogleUrl(venues[venueId])} target="_blank">{venues[venueId].details}</a>
	</p>
	<p>{openingHoursToday(venues[venueId].openingHours)}</p>

	<div class="images-container">
		{#each venues[venueId].featuredImages as imgUrl (imgUrl)}
			<img loading="lazy" src={imgUrl} alt="Restarurant or food" />
		{/each}
	</div>
	<hr />
{/each}
<h3>Last Updated: {lastUpdated}</h3>
