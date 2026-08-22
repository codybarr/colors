<script lang="ts">
import { IconCheck, IconCopy } from "@tabler/icons-svelte";

import { parseCssColor } from "$lib/color/color";

let {
  hex,
  rgb,
  oninput,
}: {
  hex: string;
  rgb: string;
  oklch: string | null;
  oninput: (value: string) => void;
} = $props();

const rgbChannels = $derived(rgb.match(/\d+/g)?.slice(0, 3) ?? ["0", "0", "0"]);
let hexValue = $derived(hex.slice(1));
let redValue = $derived(rgbChannels[0]);
let greenValue = $derived(rgbChannels[1]);
let blueValue = $derived(rgbChannels[2]);
let copied = $state<string | null>(null);

function updateColor(value: string) {
  const color = parseCssColor(value);
  if (color) oninput(color.hex);
}

function updateHex(event: Event) {
  hexValue = (event.currentTarget as HTMLInputElement).value
    .replace(/[^0-9a-f]/gi, "")
    .slice(0, 6)
    .toUpperCase();
  updateColor(`#${hexValue}`);
}

function updateRgbChannel(channel: "red" | "green" | "blue", event: Event) {
  const value = (event.currentTarget as HTMLInputElement).value;
  if (!/^\d{0,3}$/.test(value)) return;

  if (channel === "red") redValue = value;
  if (channel === "green") greenValue = value;
  if (channel === "blue") blueValue = value;

  const channels = [redValue, greenValue, blueValue];
  if (
    channels.every((entry) => /^\d{1,3}$/.test(entry) && Number(entry) <= 255)
  ) {
    updateColor(`rgb(${channels.join(" ")})`);
  }
}

function resetRgbChannel(channel: "red" | "green" | "blue") {
  if (
    channel === "red" &&
    (!/^\d{1,3}$/.test(redValue) || Number(redValue) > 255)
  )
    redValue = rgbChannels[0];
  if (
    channel === "green" &&
    (!/^\d{1,3}$/.test(greenValue) || Number(greenValue) > 255)
  )
    greenValue = rgbChannels[1];
  if (
    channel === "blue" &&
    (!/^\d{1,3}$/.test(blueValue) || Number(blueValue) > 255)
  )
    blueValue = rgbChannels[2];
}

function isInvalidChannel(value: string) {
  return value !== "" && (!/^\d{1,3}$/.test(value) || Number(value) > 255);
}

async function copyValue(label: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    copied = label;
    window.setTimeout(() => {
      if (copied === label) copied = null;
    }, 1600);
  } catch {
    // Clipboard access may be unavailable outside a secure browser context.
  }
}
</script>

<section
  class="mt-10 flex flex-wrap justify-center gap-4 text-[clamp(0.7rem,1.8vw,0.82rem)] leading-[1.6] tracking-[0.04em]"
  aria-label="Color representations"
>
  <div class="grid min-w-44 gap-1">
    <label
      class="text-[0.7rem] font-bold tracking-[0.08em] uppercase"
      for="hex-color-value">Hex</label
    >
    <div class="flex items-center gap-2 border-b border-current py-1">
      <span aria-hidden="true" class="text-[1.25rem] leading-none">#</span>
      <input
        class="min-w-0 flex-1 rounded-none border-0 bg-transparent p-0 font-inherit text-[1.25rem] leading-none tracking-normal uppercase tabular-nums focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        id="hex-color-value"
        aria-label="Hex color value"
        aria-describedby="hex-color-help"
        autocomplete="off"
        inputmode="text"
        maxlength="7"
        pattern="[0-9A-Fa-f]{6}"
        value={hexValue}
        oninput={updateHex}
      />
      <button
        class="grid shrink-0 cursor-pointer border-0 bg-transparent p-0 text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        type="button"
        aria-label="Copy hex value"
        onclick={() => copyValue("Hex", hex)}
      >
        {#if copied === "Hex"}
          <IconCheck aria-hidden="true" size={18} stroke={2} />
        {:else}
          <IconCopy aria-hidden="true" size={18} stroke={2} />
        {/if}
      </button>
    </div>
    <p
      class="m-0 text-[0.62rem] tracking-normal opacity-70"
      id="hex-color-help"
    >
      Six hexadecimal digits
    </p>
  </div>

  <fieldset class="grid min-w-[15rem] gap-1 border-0 p-0">
    <legend class="p-0 text-[0.7rem] font-bold tracking-[0.08em] uppercase"
      >RGB</legend
    >
    <div class="flex items-center gap-1.5 border-b border-current py-1">
      <span aria-hidden="true" class="text-[0.9rem] tracking-normal">rgb(</span>
      <input
        class="w-[3ch] min-w-0 rounded-none border-0 bg-transparent p-0 text-center font-inherit text-[1.05rem] leading-none tracking-normal tabular-nums focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        id="rgb-red-value"
        aria-label="Red channel"
        aria-invalid={isInvalidChannel(redValue)}
        autocomplete="off"
        inputmode="numeric"
        maxlength="3"
        value={redValue}
        oninput={(event) => updateRgbChannel("red", event)}
        onblur={() => resetRgbChannel("red")}
      />
      <span aria-hidden="true">,</span>
      <input
        class="w-[3ch] min-w-0 rounded-none border-0 bg-transparent p-0 text-center font-inherit text-[1.05rem] leading-none tracking-normal tabular-nums focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        id="rgb-green-value"
        aria-label="Green channel"
        aria-invalid={isInvalidChannel(greenValue)}
        autocomplete="off"
        inputmode="numeric"
        maxlength="3"
        value={greenValue}
        oninput={(event) => updateRgbChannel("green", event)}
        onblur={() => resetRgbChannel("green")}
      />
      <span aria-hidden="true">,</span>
      <input
        class="w-[3ch] min-w-0 rounded-none border-0 bg-transparent p-0 text-center font-inherit text-[1.05rem] leading-none tracking-normal tabular-nums focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        id="rgb-blue-value"
        aria-label="Blue channel"
        aria-invalid={isInvalidChannel(blueValue)}
        autocomplete="off"
        inputmode="numeric"
        maxlength="3"
        value={blueValue}
        oninput={(event) => updateRgbChannel("blue", event)}
        onblur={() => resetRgbChannel("blue")}
      />
      <span aria-hidden="true" class="text-[0.9rem] tracking-normal">)</span>
      <button
        class="ml-auto grid shrink-0 cursor-pointer border-0 bg-transparent p-0 text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        type="button"
        aria-label="Copy RGB value"
        onclick={() => copyValue("RGB", rgb)}
      >
        {#if copied === "RGB"}
          <IconCheck aria-hidden="true" size={18} stroke={2} />
        {:else}
          <IconCopy aria-hidden="true" size={18} stroke={2} />
        {/if}
      </button>
    </div>
    <p class="m-0 text-[0.62rem] tracking-normal opacity-70">
      Red, green, blue · 0–255
    </p>
  </fieldset>
</section>

<p class="sr-only" aria-atomic="true" aria-live="polite">
  {copied ? `${copied} value copied.` : ""}
</p>
