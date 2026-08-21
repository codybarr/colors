<script lang="ts">
import { onMount } from "svelte";

import { namedColorCatalog } from "$lib/color/catalog";
import {
	findNamedColorMatch,
	foregroundForColor,
	formatOklch,
	formatRgb,
	parseHex,
} from "$lib/color/color";

import ColorPicker from "./ColorPicker.svelte";
import ColorRepresentations from "./ColorRepresentations.svelte";
import NamedColorMatch from "./NamedColorMatch.svelte";

let selectedColor = $state("#2563EB");
let isHydrated = $state(false);
let namedColorMatch = $derived(
	findNamedColorMatch(selectedColor, namedColorCatalog),
);
let isExactMatch = $derived(namedColorMatch.hex === selectedColor);
let selectedColorRgb = $derived(formatRgb(selectedColor));
let selectedColorOklch = $derived(formatOklch(selectedColor));
let foregroundColor = $derived(foregroundForColor(selectedColor));

onMount(() => {
	isHydrated = true;
});

function selectColor(value: string) {
	const color = parseHex(value);
	if (color) selectedColor = color.hex;
}

function switchToMatch() {
	selectedColor = namedColorMatch.hex;
}
</script>

<svelte:head>
	<title>Web color identification</title>
	<meta
		name="description"
		content="Inspect an sRGB color and identify its closest named-color match."
	/>
</svelte:head>

<main
	class:exact-match={isExactMatch}
	class="color-identification"
	data-hydrated={isHydrated}
	style={`--selected-color: ${selectedColor}; --matched-color: ${namedColorMatch.hex}; --foreground-color: ${foregroundColor};`}
>
	<ColorPicker value={selectedColor} oninput={selectColor} />
	<NamedColorMatch
		name={namedColorMatch.name}
		hex={namedColorMatch.hex}
		{isExactMatch}
		onswitch={switchToMatch}
	/>
	<ColorRepresentations
		hex={selectedColor}
		rgb={selectedColorRgb}
		oklch={selectedColorOklch}
	/>
	<p class="match-announcement" aria-atomic="true" aria-live="polite">
		Named-color match: {namedColorMatch.name}, {namedColorMatch.hex}.
	</p>
</main>

<noscript>
	<p class="no-script-message">
		Interactive color identification requires JavaScript. The initial selected color is #2563EB.
	</p>
</noscript>
