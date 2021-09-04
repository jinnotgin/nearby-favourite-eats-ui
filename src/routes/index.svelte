<script lang="ts">
	import { onMount } from 'svelte';

	let currentPosition = { coords: { longitude: 0, latitude: 0 } };
	let lastUpdated;
	let venues = {};
	let filter_category = '';
	$: venuesCount = Object.keys(venues).length;
	let venuesShown = [];
	$: {
		currentPosition;
		venuesShown = Object.values(venues)
			.sort(sortFuncs.nearby)
			.filter((item) => filter_category === '' || item.categories.includes(filter_category))
			.map((item) => item.id);
		// console.log('sorted based on geolocation');
		// console.log(venuesShown);
	}

	const burppleVenusUrl =
		'https://raw.githubusercontent.com/jinnotgin/burpple-wishlist-scraper/main/data/venues.json';

	const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const dayNow = dayMap[new Date().getDay()];

	// geolocation
	const getPosition = (options) => {
		return new Promise(function (resolve, reject) {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	};

	// dirty function for categories
	const categoriesList = [
		'Western',
		'Italian',
		'Japanese',
		'French',
		'Chinese',
		'Korean',
		'Indian',
		'Thai',
		'European',
		'Mexican',
		'Vegetarian',
		'Halal',
		'Pasta',
		'Cafes & Coffee',
		'Desserts',
		'Local Delights',
		'Hawker Food',
		'Kopitiam',
		'Late Night',
		'Breakfast & Brunch',
		'Bubble Tea'
	];
	const allowedCategories = (array) => array.filter((item) => categoriesList.includes(item));

	// dirty function to get opening hours
	const openingHoursToday = (textStr) => {
		if (!!!textStr.includes(dayNow)) return '';
		return textStr.split(`${dayNow}:`)[1].split('\n')[0];
	};

	// https://jaredtong.com/burpple-beyond/
	// https://github.com/tongrhj/lickilicky/blob/79d12e46aeaf5a404d72c75c68cd48399639d236/index.html#L185-L209
	const sortFuncs = {
		name: function (a, b) {
			if (a.name > b.name) {
				return 1;
			} else if (a.name < b.name) {
				return -1;
			} else {
				return 0;
			}
		},
		price: function (a, b) {
			function extractPrice(formatted_price) {
				var price = (formatted_price && formatted_price.match(/\d/g).join('')) || 0;
				return parseInt(price, 10);
			}
			return extractPrice(a.formatted_price) - extractPrice(b.formatted_price);
		},
		nearby: function (a, b) {
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
	const generateGoogleUrl = (venue) => {
		const { name = '', details = ' ' } = venue;

		const addressParts = details.split(' ');
		const postal = addressParts[addressParts.length - 1].trim();

		const GOOGLE_MAPS_BASE = 'https://www.google.com/maps/search/?api=1&query=';
		const query = encodeURIComponent(`${name.trim()} ${postal}`);

		return `${GOOGLE_MAPS_BASE}${query}`;
	};
</script>

<svelte:head>
	<title>Nearby Favourite Eats</title>
</svelte:head>

<div class="flex space-x-6 items-center m-2">
	<div>
		<span class="text-2xl md:text-3xl font-semibold">FavEats</span>
		<span class="text-xs font-light">{venuesCount}</span>
	</div>
	<div class="flex-grow text-right">
		<select class="border-2 w-40 sm:w-1/2 md:w-96" bind:value={filter_category}>
			<option value="">All</option>
			{#each categoriesList as category}
				<option value={category}>
					{category}
				</option>
			{/each}
		</select>
	</div>
</div>
<hr />
<div class="flex flex-wrap p-2 space-y-4">
	{#each venuesShown as venueId (venueId)}
		<div class="w-full sm:w-1/2 md:w-1/3 flex">
			<div class="flex bg-white rounded-xl shadow-md items-center p-3 mx-2 flex-1 space-x-3">
				<div class="flex-shrink-0">
					<img
						class="h-24 w-24 rounded-lg"
						src={venues[venueId].featuredImages[0]}
						alt={venues[venueId].name}
						loading="lazy"
					/>
				</div>
				<div class="flex-grow flex flex-col gap-1">
					<div class="text-xl font-medium text-black">{venues[venueId].name}</div>
					<div class="flex flex-wrap gap-1">
						{#each allowedCategories(venues[venueId].categories) as category (category)}
							<div class="flex-initial rounded-full py-1 px-2 text-xs bg-purple-100">
								{category}
							</div>
						{/each}
					</div>
					<p class="text-sm text-gray-600">
						<a href={generateGoogleUrl(venues[venueId])} target="_blank"
							>{venues[venueId].details}</a
						>
					</p>
					<p class="text-sm text-gray-400 ml-auto">
						{openingHoursToday(venues[venueId].openingHours)}
					</p>
				</div>
			</div>
		</div>
	{/each}
</div>
<h3>Last Updated: {lastUpdated}</h3>

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
