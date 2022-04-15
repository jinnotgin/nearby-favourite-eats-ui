<!-- 
// Adapted from https://github.com/CaptainCodeman/sveltekit-example/blob/master/src/lib/Auth.svelte
-->
<script lang="ts">
	// TODO: learn typescript and fix import error
	import { auth } from './auth';
	import { browser } from '$app/env';
	import { onMount, onDestroy } from 'svelte';
	import Button from '$lib/Button.svelte';
	import Avatar from '$lib/Avatar.svelte';
	import { isDemoMode } from '$lib/utils';

	let usernameBurpple = '';
	let unsubscribe = () => {};
	onMount(async () => {
		if (browser) {
			if (isDemoMode()) {
				usernameBurpple = 'jinnotgin';
			} else {
				const { db } = await import('$lib/database'); // using import here for it to work with sveltekit static adapter

				unsubscribe = db.subscribe((value) => {
					usernameBurpple = value.usernameBurpple;
				});
			}
		}
	});
	onDestroy(unsubscribe);
</script>

{#if isDemoMode()}
	<div class="flex flex-row gap-4 place-items-center">
		<div class="flex flex-row gap-2 place-items-center">
			<div class="bg-yellow-500 text-white px-2 rounded-lg uppercase font-semibold">Demo</div>
			<span>@jinnotgin</span>
			<Avatar uid={`jin-DEMO-SEED-10`} size="2rem" />
		</div>
	</div>
{:else if $auth.known}
	{#if $auth.user}
		<div class="flex flex-row gap-4 place-items-center">
			<a class="flex flex-row gap-2 place-items-center" sveltekit:prefetch href="/profile">
				<div>
					<span>{usernameBurpple ? `@${usernameBurpple}` : 'Anonymous'}</span>
				</div>
				<Avatar uid={$auth.user.uid} size="2rem" />
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
