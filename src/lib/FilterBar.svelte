<script>
	import Button from '$lib/Button.svelte';
	let y;

	// TODO: refactor into uitls
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	};
</script>

<svelte:window bind:scrollY={y} />

<section>
	<div
		class="text-sm md:text-base my-1.5 flex flex-wrap justify-between md:justify-around flex-1 gap-2"
	>
		<slot />
	</div>
	<div
		class="flex-initial hidden sm:inline-block transition ml-4 mr-2"
		on:click={scrollToTop}
		style="opacity: {Math.max(0, Math.min(1, y / 40))}"
	>
		<Button>Back to Top</Button>
	</div>
</section>

<style>
	section {
		@apply sticky top-12 bg-white py-2 px-2 drop-shadow-md rounded-md flex items-center;
	}
</style>
