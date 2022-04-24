<script>
	import Button from '$lib/Button.svelte';
</script>

<section>
	<div
		class="text-sm md:text-base my-1.5 flex flex-wrap justify-between md:justify-around flex-1 gap-2"
	>
		<slot />
	</div>
</section>

<style>
	section {
		@apply sticky top-11 bg-white py-2 px-2 drop-shadow-md rounded-md flex items-center z-10;
	}
</style>
