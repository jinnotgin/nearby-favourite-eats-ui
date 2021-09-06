<button on:click>
	<slot />
</button>

<style>
	button {
		@apply bg-blue-600 text-white p-2 rounded-md text-sm select-none cursor-pointer;
	}
</style>
