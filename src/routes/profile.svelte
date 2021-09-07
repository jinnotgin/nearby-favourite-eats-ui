<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser, dev } from '$app/env';
	// TODO: learn typescript and fix import error
	import { auth } from '$lib/auth';
	import { goto } from '$app/navigation';
	import Avatar from '$lib/Avatar.svelte';
	import Button from '$lib/Button.svelte';
	import FormField from '$lib/FormField.svelte';
	import Input from '$lib/Input.svelte';

	let db;
	let dbStore = { known: false };
	let unsubscribe = () => {};
	onMount(async () => {
		if (browser) {
			const { _db } = await import('$lib/database'); // using import here for it to work with sveltekit static adapter
			db = _db;

			unsubscribe = db.subscribe((value) => {
				dbStore = value;
			});
		}
	});
	onDestroy(unsubscribe);

	let formPrefilled = false;
	let input_usernameBurpple = '';
	$: {
		if (dbStore.known && !formPrefilled) {
			console.log('ran');
			console.log(dbStore);
			input_usernameBurpple = dbStore.usernameBurpple;
			formPrefilled = true;
		}
	}
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
					<Input bind:value={input_usernameBurpple} />
				</FormField>

				<Button
					on:click={async () => {
						await db.setUserInfo($auth.user.uid, { usernameBurpple: input_usernameBurpple.trim() });
						goto('/');
					}}>Save</Button
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
