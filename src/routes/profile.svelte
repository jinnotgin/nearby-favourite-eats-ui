<script>
	import { browser, dev } from '$app/env';
	// TODO: learn typescript and fix import error
	import { authStore, createAuth } from '$lib/auth';
	import { createDb } from '$lib/database';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Avatar from '$lib/Avatar.svelte';
	import Button from '$lib/Button.svelte';
	import FormField from '$lib/FormField.svelte';
	import Input from '$lib/Input.svelte';

	let auth = authStore;
	let db;
	let usernameBurpple;
	onMount(async () => {
		if (browser) {
			auth = createAuth();
			db = createDb();

			console.log(db);
			console.log($auth);
		}
	});

	$: {
		$auth.user && getUsernameBurpple();
	}

	const getUsernameBurpple = async () => {
		const doc = await db.getUserInfo($auth.user.uid);
		console.log(doc.usernameBurpple);
		usernameBurpple = doc.usernameBurpple;
	};
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<section>
	{#if $auth.known}
		{#if $auth.user}
			<div>You are currently logged in as {$auth.user.displayName} ({$auth.user.email}).</div>
			<div>{$auth.user.uid}</div>
			<div>
				<FormField label="Burrple Username">
					<Input bind:value={usernameBurpple} />
				</FormField>

				<Button
					on:click={() => {
						console.log($auth.user.uid, { usernameBurpple });
						db.setUserInfo($auth.user.uid, { usernameBurpple });
					}}>Save Burpple</Button
				>
			</div>
			<div>
				<Button
					on:click={() => {
						auth.signOut();
						goto('/');
					}}>Sign Out</Button
				>
			</div>
		{:else}
			<div>User is not logged in</div>
		{/if}
	{:else}
		Loading...
	{/if}
</section>

<style>
	section {
		@apply text-xl flex flex-col gap-4;
	}
</style>
