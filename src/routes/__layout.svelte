<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import smoothscroll from 'smoothscroll-polyfill';
	import '../app.postcss';

	import { browser } from '$app/env';
	import { auth } from '$lib/auth';
	import { onMount, onDestroy } from 'svelte';

	let db = null;
	let unsubscribe = () => {};
	onMount(async () => {
		if (browser) {
			const { db } = await import('$lib/database'); // using import here for it to work with sveltekit static adapter

			auth.onAuthStateChanged(async () => {
				if ($auth.user) {
					await db.getUserInfo($auth.user.uid);
				}
			});

			// apply smooth scroll polyfill (https://github.com/iamdustan/smoothscroll)
			smoothscroll.polyfill();
		}
	});
</script>

<Header />
<main>
	<slot />
</main>

<footer>
	<p>
		Copyright 2021 - {new Date().getFullYear()} || Made by
		<a href="https://jinn.me" target="_blank">jinn.me</a>.
	</p>
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
