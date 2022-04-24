<script>
	import {
		allowedCategories,
		openingHoursToday,
		isClosedNow,
		generateGoogleUrl
	} from '$lib/utils-dataProcessing';

	// TODO: Find another place to host the imgur image
	const PLACEHOLDER_IMAGE_URL = 'https://i.imgur.com/nEkkYfil.png';
	const OPEN_IN_NEW_TAB_ICON_URL = 'https://i.imgur.com/00NQgEG.png';

	export let venue = {};
</script>

<div class="w-full flex">
	<div class="flex bg-white rounded-xl shadow-md items-center p-3 flex-1 space-x-3">
		<div class="flex-shrink-0">
			<a href={venue.venueUrl} target="_blank"
				><img
					class="h-24 w-24 rounded-lg"
					src={venue.featuredImages.length > 0 ? venue.featuredImages[0] : PLACEHOLDER_IMAGE_URL}
					on:error={(event) => {
						// TODO: Proper error handling for failed images
						console.log('error loading image', event);
						if (event.target.currentSrc !== PLACEHOLDER_IMAGE_URL)
							event.target.src = PLACEHOLDER_IMAGE_URL;
					}}
					alt={venue.name}
					loading="lazy"
				/></a
			>
		</div>
		<div class="flex-grow flex flex-col gap-1">
			<div class="text-xl font-medium text-black">
				<a href={venue.venueUrl} target="_blank">{venue.name}</a>
			</div>
			<div class="flex flex-wrap gap-1">
				{#each allowedCategories(venue.categories) as category (category)}
					<div class="flex-initial rounded-full py-1 px-2 text-xs bg-purple-100">
						{category}
					</div>
				{/each}
			</div>
			<p class="text-sm text-gray-600">
				<a href={generateGoogleUrl(venue)} target="_blank"
					>{venue.details}
					<img
						class="inline opacity-60"
						src={OPEN_IN_NEW_TAB_ICON_URL}
						alt="Open in new tab icon"
						width="16"
					/></a
				>
			</p>
			<p class="text-sm text-gray-400 ml-auto">
				{openingHoursToday(venue.openingHours)}
				{isClosedNow(openingHoursToday(venue.openingHours)) ? ' ⛔' : ''}
			</p>
		</div>
	</div>
</div>
