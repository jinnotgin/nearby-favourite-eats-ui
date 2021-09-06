<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.postcss';
</script>

<Header />
<main>
	<slot />
</main>

<footer>
	<p>Copyright 2021 <a href="https://jinn.me">jinn.me</a>.</p>
</footer>

<style>
	main {
		@apply flex-1 flex flex-col p-4 w-full max-w-7xl my-0 mx-auto;
	}

	footer {
		@apply flex flex-col justify-center items-center pb-8;
	}

	footer a {
		@apply font-bold;
	}
</style>
