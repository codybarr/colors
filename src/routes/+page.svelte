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

import { colorFamilyLabel, identifyColorFamily } from "$lib/color/family";

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
let selectedColorFamily = $derived(colorFamilyLabel(identifyColorFamily(selectedColor)));
let matchColorFamily = $derived(colorFamilyLabel(identifyColorFamily(namedColorMatch.hex)));
let selectedColorRgb = $derived(formatRgb(selectedColor));
let selectedColorOklch = $derived(formatOklch(selectedColor));
let foregroundColor = $derived(foregroundForColor(selectedColor));
let matchForegroundColor = $derived(foregroundForColor(namedColorMatch.hex));

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
  class="grid min-h-svh min-w-80 grid-rows-2 font-['DM_Mono',ui-monospace,monospace] motion-safe:transition-[background-color] motion-safe:duration-120 motion-safe:ease-linear"
  data-hydrated={isHydrated}
  style={`background-color: ${selectedColor}; background-image: ${isExactMatch ? "none" : `linear-gradient(180deg, ${selectedColor} 0 50%, ${namedColorMatch.hex} 50% 100%)`}; color: ${foregroundColor};`}
>
  <section
    class="flex min-h-88 flex-col items-center justify-center px-3 py-8 sm:px-6"
    aria-labelledby="selected-color-heading"
  >
    <h1 id="selected-color-heading" class="m-0 text-xs font-normal tracking-[0.08em] uppercase">Your color</h1>
    <p class="mt-3 mb-0 text-lg font-bold text-center" data-testid="selected-color-family">
      <span class="text-xs font-normal">Color family:</span> {selectedColorFamily}
    </p>
    <p class="mt-2 mb-6 text-sm tabular-nums">{selectedColor}</p>
    <div class="w-full max-w-168">
      <ColorPicker value={selectedColor} oninput={selectColor} />
      <ColorRepresentations
        hex={selectedColor}
        rgb={selectedColorRgb}
        oklch={selectedColorOklch}
        oninput={selectColor}
      />
    </div>
  </section>
  <div class="flex min-h-88 items-center justify-center px-3 py-8 sm:px-6" style={`color: ${matchForegroundColor};`}>
    <NamedColorMatch
      name={namedColorMatch.name}
      hex={namedColorMatch.hex}
      family={matchColorFamily}
      {isExactMatch}
      onswitch={switchToMatch}
    />
  </div>
  <p class="sr-only" aria-atomic="true" aria-live="polite">
    Selected color: {selectedColor}, color family: {selectedColorFamily}.
    Named-color match: {namedColorMatch.name}, {namedColorMatch.hex}. Color family: {matchColorFamily}.
  </p>
</main>

<noscript>
  <p class="fixed bottom-4 left-4 m-0 max-w-120 bg-black px-4 py-3 text-white">
    Interactive color identification requires JavaScript. The initial selected
    color is {selectedColor}.
  </p>
</noscript>
