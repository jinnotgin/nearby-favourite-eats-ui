<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/env';

	// Utils & Constants
	import { sortFuncs, capitalizeFirstLetter, isDemoMode } from '$lib/utils';
	import { scrollToTop } from '$lib/scrollToTop';
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

	// map selector related
	import Map from '$lib/Map.svelte';
	let mapComponent;

	// User Authorisation
	import { auth } from '$lib/auth';
	import Auth from '$lib/Auth.svelte';

	// User Data
	let dbStore = { usernameBurrple: null, known: false };
	let unsubscribe = () => {};
	onMount(async () => {
		if (browser) {
			if (isDemoMode()) {
				dbStore = { usernameBurpple: 'jinnotgin', known: true };
				console.log(
					'Demonstration Mode - default to "jinnotgin" with limited functionality.',
					dbStore
				);
			} else {
				const { db } = await import('$lib/database'); // using import here for it to work with sveltekit static adapter

				unsubscribe = db.subscribe((value) => {
					dbStore = value;
				});
			}
		}
	});
	onDestroy(unsubscribe);

	// STATES
	let targetPosition = { name: 'unknown', coords: { longitude: 0, latitude: 0 } };
	let positionName = 'unknown';
	let showMap = false;
	let allPositions = {
		nearby: { name: 'nearby', coords: { longitude: 0, latitude: 0 } },
		...savedPositions,
		custom: { name: 'custom', coords: { longitude: 0, latitude: 0 } }
	};
	$: {
		if (Object.keys(allPositions).includes(positionName)) {
			targetPosition = allPositions[positionName];
			console.log('Changed position to', positionName, targetPosition);
		}
		if (positionName !== 'custom') {
			delete allPositions.custom;
			allPositions = { ...allPositions };
		}
	}

	let venues = {};
	let lastUpdated = false;
	let filter_category = '';
	let venuesKnown = false;
	let venuesShown = [];
	let pageSize = 3 * 5;
	let pagesShown = 1;
	$: pagesMaxItems = pageSize * pagesShown;

	const resetVenuesState = () => {
		console.log('Resetting states related to venues...');
		venues = {};
		venuesKnown = false;
		venuesShown = [];
		lastUpdated = false;
		filter_category = '';
		pagesShown = 1;
	};
	$: {
		!$auth.user && !isDemoMode() && resetVenuesState();
	}

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

	onMount(() => {
		if (browser) getUserPosition();
	});

	// Geolocation
	const getUserPosition = async () => {
		console.log("Getting user's position...");
		const geolocationData = await _getUserPosition({
			enableHighAccuracy: true,
			timeout: 10000
		});
		const { coords } = geolocationData;
		allPositions.nearby.coords = coords;
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
	{#if lastUpdated}
		{#if showMap}
			<div class="flex flex-col gap-2">
				<Map bind:this={mapComponent} />
				<Button
					fullWidth
					on:click={() => {
						const mapCenter = mapComponent.getCenter();
						allPositions = {
							...allPositions,
							custom: {
								name: 'custom',
								coords: { longitude: mapCenter.lng, latitude: mapCenter.lat }
							}
						};
						positionName = 'custom';
						showMap = false;
					}}>Set Custom Location</Button
				>
			</div>
		{:else}
			<!-- TODO: May not be intuitive why we use lastUpdated as the condition check-->
			<FilterBar>
				<FormField label="Location">
					<Select
						options={Object.values(allPositions).map((item) => {
							return { name: capitalizeFirstLetter(item.name), value: item.name };
						})}
						bind:value={positionName}
					/>

					<Button
						variant="secondary"
						thin
						on:click={() => {
							scrollToTop();
							showMap = true;
						}}>Set Custom</Button
					>
				</FormField>
				<FormField label="Category">
					<Select
						options={[
							{ name: 'All', value: '' },
							...categoriesList.map((item) => {
								return { name: item, value: item };
							})
						]}
						bind:value={filter_category}
					/>
				</FormField>
				<Button
					variant="secondary"
					thin
					on:click={() => {
						venuesShown = [];
						venuesKnown = false;

						getUserPosition();
						setTimeout(getVenuesData, 250);
					}}
					>Refresh
				</Button>
			</FilterBar>
		{/if}
	{/if}

	{#if !showMap}
		<section>
			{#if !$auth.known && !isDemoMode()}
				<IllustrativeMessage title="Please wait... " body="" />
			{:else if !$auth.user && !isDemoMode()}
				<IllustrativeMessage title="Hi there! 👋 ">
					<div>Welcome to <em>FavEats</em> - helping you find nearby favourite eats! 🍱</div>
					<div>
						<em>FavEats</em> does this by referencing your
						<span class="font-semibold">Burpple account</span>
						and gathering the places that are currently in your wishlist.
					</div>
					<div>Sounds interesting? Click on the buttons below to begin!</div>
				</IllustrativeMessage>
				<div class="flex place-content-center flex-col gap-2">
					<Button
						variant="secondary"
						on:click={() => {
							window.location.assign('/?demo');
						}}
						>Hmm, let me try it out first (Demo Mode)
					</Button>
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
						Please check that your Burpple Username is correct, and you have wishlisted some places
						as well! 🙏
					</div>
					<div class="flex place-content-center">
						<Button on:click={() => goto('/profile')}>Go to Profile</Button>
					</div>
				</IllustrativeMessage>
			{:else if venuesShown.length === 0}
				<IllustrativeMessage title="Preparing your data 🏃‍♂️">
					<div>
						Please come back in a <span class="font-semibold">few hours time</span>, and check that
						your Burrple Username is correctly entered as well! 👍
					</div>
				</IllustrativeMessage>
			{:else}
				<Grid>
					{#each venuesShown.slice(0, pageSize * pagesShown) as venueId (venueId)}
						<VenueCard venue={venues[venueId]} />
					{/each}
				</Grid>
				{#if venuesShown.length > pagesMaxItems}
					<div class="flex flex-col gap-2 place-content-center mb-8">
						<Button
							fullWidth
							variant="secondary"
							on:click={() => {
								pagesShown += 1;
							}}>Show more venues</Button
						>
						{#if isDemoMode()}
							<Button fullWidth on:click={() => window.location.assign('/')}
								>🚨 - Exit Demo Mode - 🚨</Button
							>
						{/if}
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
	{/if}

	<!-- <Counter />-->
</section>
