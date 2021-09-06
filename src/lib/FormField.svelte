<script>
	export let label = 'Unknown label';
</script>

<section>
	<div class="label">{label}</div>
	<div class="flex-1">
		<slot>
			<span class="text-gray-400">Unknown Input</span>
		</slot>
	</div>
</section>

<style>
	section {
		@apply flex gap-2 items-center;
	}
	.label {
		@apply font-semibold;
	}
	.label:after {
		content: ':';
	}
</style>
