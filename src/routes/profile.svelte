<script context="module">
	import { browser, dev } from '$app/env';
	// TODO: learn typescript and fix import error
	import { authStore, createAuth } from '$lib/auth';
	import { onMount } from 'svelte';
	import Avatar from '$lib/Avatar.svelte';

	let auth = authStore;
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<section>
	{#if $auth.known}
		{#if $auth.user}
			<div>{$auth.user.displayName} ({$auth.user.email})</div>
			<Avatar
				src={$auth.user.photoURL}
				alt="{$auth.user.displayName} ({$auth.user.email})"
				size="1.5rem"
			/>
		{:else}
			<div>User is not logged in</div>
		{/if}
	{:else}
		Loading...
	{/if}
</section>
