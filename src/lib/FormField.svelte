<script>
	export let label = 'Unknown label';
</script>

<div class="flex gap-2 items-center">
	<div class="label flex-shrink">{label}</div>
	<div class="flex-grow">
		<slot>
			<span class="text-gray-400">Unknown Input</span>
		</slot>
	</div>
</div>

<style>
	.label {
		@apply font-semibold;
	}
	.label:after {
		content: ':';
	}
</style>
