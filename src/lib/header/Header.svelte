<script lang="ts">
	import { page } from '$app/stores';
	import logo from './faveats-logo.svg';
	import { scrollToTop } from '$lib/scrollToTop';
	import Auth from '$lib/Auth.svelte';
	import { isDemoMode } from '$lib/utils';
</script>

<header>
	<div>
		<a sveltekit:prefetch href={isDemoMode() ? '/?demo' : '/'} on:click={scrollToTop}>
			<div class="brand">
				<img src={logo} alt="FavEats" />
				<span>FavEats</span>
			</div>
		</a>
	</div>

	<nav>
		<ul>
			<li><Auth /></li>
		</ul>
		<!--
		<ul>
			<li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.path === '/about'}><a sveltekit:prefetch href="/about">About</a></li>
			<li class:active={$page.path === '/todos'}><a sveltekit:prefetch href="/todos">Todos</a></li>
		</ul>
		-->
	</nav>
</header>

<style>
	header {
		@apply flex justify-between bg-gray-200 drop-shadow place-items-center text-gray-800 sticky top-0 z-10;
	}

	.brand {
		@apply flex place-items-center;
	}

	.brand img {
		@apply w-6 h-6 m-2;
	}

	.brand span {
		@apply font-semibold text-xl;
	}

	nav {
		@apply px-4 text-base;
	}

	nav ul {
		@apply flex flex-row gap-4 place-items-center;
	}
	/*
	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 10%;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}*/
</style>
