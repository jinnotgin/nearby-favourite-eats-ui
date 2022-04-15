<script>
	export let fullWidth = undefined;
	export let thin = undefined;
	export let variant = 'primary';

	let customClassStrings = `
		py-2
		${fullWidth ? 'w-full' : ''}
		${thin ? 'py-1' : ''}
		${variant === 'primary' ? 'bg-blue-600 text-white ' : ''}
		${
			variant === 'secondary'
				? 'bg-white text-blue-600 border-blue-600 border-2 border-opacity-50'
				: ''
		}
		${variant === 'danger' ? 'bg-red-700 text-white ' : ''}
	`;
	console.log(customClassStrings);
</script>

<button class={customClassStrings} on:click>
	<slot />
</button>

<style>
	button {
		@apply px-3 rounded-md text-sm select-none cursor-pointer;
	}
</style>
