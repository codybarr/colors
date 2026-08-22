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

let { data } = $props();

let selectedColorOverride = $state<string | null>(null);
let selectedColor = $derived(
  selectedColorOverride ?? data.initialSelectedColor,
);
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
  if (color) selectedColorOverride = color.hex;
}

function switchToMatch() {
  selectedColorOverride = namedColorMatch.hex;
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
  class="grid min-h-svh min-w-80 grid-cols-[min(100%,42rem)] content-center justify-center p-3 font-['DM_Mono',ui-monospace,monospace] motion-safe:transition-[background-color] motion-safe:duration-120 motion-safe:ease-linear sm:p-6"
  data-hydrated={isHydrated}
  style={`background-color: ${selectedColor}; background-image: ${isExactMatch ? "none" : `linear-gradient(180deg, ${selectedColor} 0 50%, ${namedColorMatch.hex} 50% 100%)`}; color: ${foregroundColor};`}
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
    oninput={selectColor}
  />
  <p class="sr-only" aria-atomic="true" aria-live="polite">
    Named-color match: {namedColorMatch.name}, {namedColorMatch.hex}.
  </p>
</main>

<noscript>
  <p class="fixed bottom-4 left-4 m-0 max-w-120 bg-black px-4 py-3 text-white">
    Interactive color identification requires JavaScript. The initial selected
    color is {selectedColor}.
  </p>
</noscript>
