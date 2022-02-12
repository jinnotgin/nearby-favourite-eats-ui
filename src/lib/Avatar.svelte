<script>
	export let uid;
	export let size = '3rem';

	import { createAvatar } from '@dicebear/avatars';
	import * as style from '@dicebear/adventurer-neutral';

	// old image generated from robohash `https://robohash.org/${$auth.user.uid}.png?set=set1&size=64x64`
	// replaced with DiceBear Avatars
	let svg = createAvatar(style, {
		seed: uid,
		backgroundColor: ['variant01', 'variant02', 'variant03']
	});

	const svgToDataURL = (svgStr) => {
		const encoded = encodeURIComponent(svgStr).replace(/'/g, '%27').replace(/"/g, '%22');

		const header = 'data:image/svg+xml,';
		const dataUrl = header + encoded;

		return dataUrl;
	};
</script>

<img
	class="rounded-full border-gray-300 border-2 bg-white"
	src={svgToDataURL(svg)}
	alt="{uid}'s profile picture (anonymously generated)"
	style="height:{size}; width: {size}"
/>
