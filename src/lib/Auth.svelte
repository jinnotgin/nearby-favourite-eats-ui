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
	import { signInAnonymously } from '@firebase/auth';

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
					<!--<span>{usernameBurpple ? `@${usernameBurpple}` : $auth.user.displayName}</span>-->
					<span>{usernameBurpple ? `@${usernameBurpple}` : 'Anonymous'}</span>
				</div>
				<!--<Avatar
					src={$auth.user.photoURL}
					alt="{$auth.user.displayName} ({$auth.user.email})"
					size="2rem"
				/>-->
				<Avatar
					src={`https://robohash.org/${$auth.user.uid}.png?set=set1&size=64x64`}
					alt="Anonymous user's randomly generated avatar"
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
		<!-- <Button on:click={() => auth.signInWith('google')}>Sign In with Google</Button> -->
		<Button on:click={() => auth.signInAnonymously()}>Let's Begin</Button>
	{/if}
{:else}
	Loading...
{/if}
