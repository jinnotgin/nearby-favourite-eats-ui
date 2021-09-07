<!-- 
// Adapted from https://github.com/CaptainCodeman/sveltekit-example/blob/master/src/lib/Auth.svelte
-->
<script lang="ts">
	// TODO: learn typescript and fix import error
	import { auth } from './auth';
	import { browser } from '$app/env';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import Avatar from '$lib/Avatar.svelte';

	let usernameBurpple = '';
	let unsubscribe = () => {};
	onMount(async () => {
		if (browser) {
			const { db } = await import('$lib/database'); // using import here for it to work with sveltekit static adapter

			unsubscribe = db.subscribe((value) => {
				usernameBurpple = value.usernameBurpple;
			});
		}
	});
	onDestroy(unsubscribe);
</script>

{#if $auth.known}
	{#if $auth.user}
		<div class="flex flex-row gap-4 place-items-center">
			<!-- <div>{$auth.user.displayName} ({$auth.user.email})</div> -->
			<a class="flex flex-row gap-2 place-items-center" sveltekit:prefetch href="/profile">
				<div>
					{$auth.user.displayName}
					<span>{usernameBurpple ? ` (${usernameBurpple})` : ''}</span>
				</div>
				<Avatar
					src={$auth.user.photoURL}
					alt="{$auth.user.displayName} ({$auth.user.email})"
					size="2rem"
				/>
			</a>
			<!--<Button
				on:click={() => {
					auth.signOut();
					goto('/');
				}}>Sign Out</Button
			>-->
		</div>
	{:else}
		<Button on:click={() => auth.signInWith('google')}>Sign In with Google</Button>
	{/if}
{:else}
	Loading...
{/if}
