<div>
	<div class="label">
		<slot name="label">
			<span class="text-gray-400">Unknown Label</span>
		</slot>
	</div>
	<div class="flex-1">
		<slot name="input">
			<span class="text-gray-400">Unknown Input</span>
		</slot>
	</div>
</div>

<style>
	div {
		@apply flex gap-2 items-center;
	}
	.label {
		@apply font-semibold;
	}
	.label:after {
		content: ':';
	}
</style>
