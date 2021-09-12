<script>
	export let src, alt;
	export let size = '3rem';
</script>

<img
	class="rounded-full border-gray-300 border-2 bg-white"
	{src}
	{alt}
	style="height:{size}; width: {size}"
/>
