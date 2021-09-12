<script>
	export let title;
	export let body = undefined;
</script>

<div class="flex-1 flex my-4 flex-col gap-4 place-items-center">
	<div class="w-20">
		<svg
			class="w-100"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 32 32"
			fill="#002550"
			><path
				d="M16 0c8.822 0 16 6.328 16 14.106s-7.178 14.105-16 14.105c-1.783 0-4.002-.491-4.095-.513a1.405 1.405 0 00-.291-.027c-.397 0-.872.128-1.128.304l-5.412 3.721c-.294.202-.578.304-.844.304a.902.902 0 01-.712-.33c-.154-.19-.317-.542-.208-1.147l1.038-5.79c.07-.394-.183-1.15-.628-1.573-.034-.032-.228-.223-.731-.841C1.033 19.914 0 17.074 0 14.106 0 6.328 7.178 0 16 0zM8.6 17.2a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2zm8 0a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2zm8 0a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z"
				fill-rule="evenodd"
				fill="#002550"
			/></svg
		>
	</div>
	<div class="text-2xl font-bold">{title}</div>
	{#if body}
		<div>{body}</div>
	{:else}
		<slot />
	{/if}
</div>
