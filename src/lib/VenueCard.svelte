<script>
	import {
		allowedCategories,
		openingHoursToday,
		generateGoogleUrl
	} from '$lib/utils-dataProcessing';
	export let venue = {};
</script>

<div class="w-full flex">
	<div class="flex bg-white rounded-xl shadow-md items-center p-3 flex-1 space-x-3">
		<div class="flex-shrink-0">
			<a href={venue.venueUrl} target="_blank"
				><img
					class="h-24 w-24 rounded-lg"
					src={venue.featuredImages.length > 0
						? venue.featuredImages[0]
						: 'https://i.imgur.com/nEkkYfis.png'}
					on:error={(event) => {
						console.log(event);
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
				<a href={generateGoogleUrl(venue)} target="_blank">{venue.details}</a>
			</p>
			<p class="text-sm text-gray-400 ml-auto">
				{openingHoursToday(venue.openingHours)}
			</p>
		</div>
	</div>
</div>
