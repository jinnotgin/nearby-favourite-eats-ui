<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/env';

	// Utils & Constants
	import { sortFuncs, capitalizeFirstLetter } from '$lib/utils';
	import { categoriesList, savedPositions } from '$lib/utils-dataProcessing';
	import { goto } from '$app/navigation';

	// UI Components
	import FilterBar from '$lib/FilterBar.svelte';
	import FormField from '$lib/FormField.svelte';
	import Select from '$lib/Select.svelte';
	import IllustrativeMessage from '$lib/IllustrativeMessage.svelte';
	import Grid from '$lib/Grid.svelte';
	import VenueCard from '$lib/VenueCard.svelte';
	import Button from '$lib/Button.svelte';

	// User Authorisation
	import { auth } from '$lib/auth';
	import Auth from '$lib/Auth.svelte';

	// User Data
	let dbStore = { usernameBurrple: null, known: false };
	let unsubscribe = () => {};
	onMount(async () => {
		if (browser) {
			const { db } = await import('$lib/database'); // using import here for it to work with sveltekit static adapter

			unsubscribe = db.subscribe((value) => {
				dbStore = value;
			});
		}
	});
	onDestroy(unsubscribe);

	// STATES
	let targetPosition = { name: 'unknown', coords: { longitude: 0, latitude: 0 } };
	let positionName = 'unknown';
	$: {
		if (Object.keys(savedPositions).includes(positionName)) {
			targetPosition = savedPositions[positionName];
			console.log('Changed position to', targetPosition);
		}
	}

	let venues = {};
	let venuesKnown = false;
	let lastUpdated = false;

	let filter_category = '';
	let venuesShown = [];
	$: {
		// updates venues to be shown when targetPosition changes
		targetPosition;
		venuesShown = Object.values(venues)
			.sort((a, b) => sortFuncs.nearby(a, b, targetPosition))
			.filter((item) => filter_category === '' || item.categories.includes(filter_category))
			.map((item) => item.id);
		if (typeof window !== 'undefined') window.scrollTo(0, 0);
		pagesShown = 1;
	}

	let pageSize = 12;
	let pagesShown = 1;
	$: pagesMaxItems = pageSize * pagesShown;

	onMount(() => {
		if (browser) getUserPosition();
	});

	// Geolocation
	const getUserPosition = async () => {
		console.log("Getting user's position...");
		savedPositions.nearby = await _getUserPosition({
			enableHighAccuracy: true,
			timeout: 10000
		});
		console.log("Resolved user's position.");
		if (positionName === 'unknown') positionName = 'nearby';
	};
	const _getUserPosition = async (options) => {
		return new Promise(function (resolve, reject) {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
	};

	// Get user data
	$: burppleVenusUrl = `https://raw.githubusercontent.com/jinnotgin/burpple-wishlist-scraper/main/data/${dbStore.usernameBurpple}/venues.json`;
	const getVenuesData = async () => {
		if (!!!dbStore.known || !!!dbStore.usernameBurpple) return false;

		try {
			// TODO: hack to always get new data without cache
			// const res = await fetch(`${burppleVenusUrl}?${new Date().getTime()}`);
			// const res = await fetch(`${burppleVenusUrl}?${new Date().setMinutes(0, 0, 0)}`);
			const res = await fetch(`${burppleVenusUrl}`);
			const resJson = await res.json();

			venues = resJson.data;
			lastUpdated = new Date(resJson.end);
			venuesKnown = true;
		} catch (e) {
			venues = {};
			lastUpdated = false;
			venuesKnown = true;
		}
	};
	$: {
		// Load venues data when the burpple username is known
		dbStore.known && dbStore.usernameBurpple && getVenuesData();
	}
</script>

<svelte:head>
	<title>FavEats: Nearby Favourite Eats</title>
</svelte:head>

<section>
	<FilterBar>
		<FormField label="Location">
			<Select
				options={Object.keys(savedPositions)}
				display_func={(o) => capitalizeFirstLetter(o)}
				bind:value={positionName}
			/>
		</FormField>
		<FormField label="Category">
			<Select
				options={['', ...categoriesList]}
				display_func={(o) => (o === '' ? 'All' : o)}
				bind:value={filter_category}
			/>
		</FormField>
		<Button
			on:click={() => {
				venuesShown = [];
				venuesKnown = false;

				getUserPosition();
				setTimeout(getVenuesData, 250);
			}}
			>Refresh
		</Button>
	</FilterBar>

	<section>
		{#if !$auth.known}
			<IllustrativeMessage title="Please wait... " body="" />
		{:else if !$auth.user}
			<IllustrativeMessage title="Hi there! 👋 " body="Please sign in first." />
			<div class="flex place-content-center">
				<Auth />
			</div>
		{:else if !dbStore.known}
			<IllustrativeMessage title="Please wait... " body="" />
		{:else if !dbStore.usernameBurpple}
			<IllustrativeMessage title="You're almost there! 💪">
				<div>
					Please provide your <span class="font-semibold">Burpple Username</span> in your Profile settings.
				</div>
				<div class="flex place-content-center">
					<Button on:click={() => goto('/profile')}>Go to Profile</Button>
				</div>
			</IllustrativeMessage>
		{:else if !venuesKnown}
			<IllustrativeMessage title="Please wait... " body="" />
		{:else if venuesShown.length === 0 && lastUpdated}
			<IllustrativeMessage title="Data not found 🤔">
				<div>
					We couldn't find any wishlisted places from <a
						href={`https://www.burpple.com/@${dbStore.usernameBurpple}/wishlist`}
						class="text-blue-600 underline"
						target="_blank">your Burpple account</a
					>.
				</div>
				<div>
					Please check that your Burpple Username is correct, and you have wishlisted some places as
					well! 🙏
				</div>
				<div class="flex place-content-center">
					<Button on:click={() => goto('/profile')}>Go to Profile</Button>
				</div>
			</IllustrativeMessage>
		{:else if venuesShown.length === 0}
			<IllustrativeMessage title="Preparing your data 🏃‍♂️">
				<div>
					Please come back in a <span class="font-semibold">few hours time</span>, and check that
					your Burrple username is correctly entered as well! 👍
				</div>
			</IllustrativeMessage>
		{:else}
			<Grid>
				{#each venuesShown.slice(0, pageSize * pagesShown) as venueId (venueId)}
					<VenueCard venue={venues[venueId]} />
				{/each}
			</Grid>
			{#if venuesShown.length > pagesMaxItems}
				<div class="flex place-content-center mb-8">
					<Button
						fullWidth
						variant="secondary"
						on:click={() => {
							pagesShown += 1;
						}}>Show more venues</Button
					>
				</div>
			{/if}
			<div class="m-6 text-gray-400 text-xs text-center">
				Last Updated: {lastUpdated
					? lastUpdated.toLocaleString(undefined, {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							hour12: true
					  })
					: '-'}
			</div>
		{/if}
		<div class="mb-8" />
	</section>

	<!-- <Counter />-->
</section>
