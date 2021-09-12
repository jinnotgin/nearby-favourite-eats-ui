<script>
	export let fullWidth = undefined;
	export let variant = 'primary';

	let customClassStrings = `
		${fullWidth ? 'w-full' : ''}
		${variant === 'primary' ? 'bg-blue-600 text-white ' : ''}
		${
			variant === 'secondary'
				? 'bg-white text-blue-600 border-blue-600 border-2 border-opacity-50'
				: ''
		}
		${variant === 'danger' ? 'bg-red-700 text-white ' : ''}
	`;
</script>

<button class={customClassStrings} on:click>
	<slot />
</button>

<style>
	button {
		@apply py-2 px-3 rounded-md text-sm select-none cursor-pointer;
	}
</style>
