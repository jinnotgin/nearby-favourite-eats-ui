<script>
	export let options = [];
	export let display_func = (a) => a;
	export let value;
	let prev_value;
	let internalState_value;

	$: {
		if (prev_value === value) {
			// external values haven't changed, so its an internal state change
			// so, we we will propogate the internal state change externally
			value = internalState_value;
		} else {
			// external value has changed
			// so, we will update the internal state
			internalState_value = value;
		}
		prev_value = value;
	}
</script>

<select class="border-2 rounded-md capitalize" bind:value={internalState_value}>
	{#each options as option, i}
		<option value={option.value}>{display_func(option.name)}</option>
	{/each}
</select>
