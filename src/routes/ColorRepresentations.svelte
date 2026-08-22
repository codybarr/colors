<script lang="ts">
  import { IconCheck, IconCopy } from "@tabler/icons-svelte";

  import { parseCssColor } from "$lib/color/color";

  let {
    hex,
    rgb,
    oklch,
    oninput,
  }: {
    hex: string;
    rgb: string;
    oklch: string | null;
    oninput: (value: string) => void;
  } = $props();
  let hexValue = $derived(hex);
  let rgbValue = $derived(rgb);
  let oklchValue = $derived(oklch ?? "");
  let copied = $state<string | null>(null);

  function updateColor(value: string) {
    const color = parseCssColor(value);
    if (color) oninput(color.hex);
  }

  function updateHex(event: Event) {
    hexValue = (event.currentTarget as HTMLInputElement).value;
    updateColor(hexValue);
  }

  function updateRgb(event: Event) {
    rgbValue = (event.currentTarget as HTMLInputElement).value;
    updateColor(rgbValue);
  }

  function updateOklch(event: Event) {
    oklchValue = (event.currentTarget as HTMLInputElement).value;
    updateColor(oklchValue);
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
  <div class="grid gap-1">
    <label class="text-[0.7rem] font-bold tracking-[0.08em] uppercase" for="hex-color-value">Hex</label>
    <div class="flex items-center border-b border-current">
      <input
        class="w-[7ch] min-w-0 rounded-none border-0 bg-transparent py-1 font-inherit text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        id="hex-color-value"
        aria-label="Hex color value"
        value={hexValue}
        oninput={updateHex}
      />
      <button
        class="grid cursor-pointer border-0 bg-transparent py-[0.2rem] pr-0 pl-[0.4rem] text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        type="button"
        aria-label="Copy hex value"
        onclick={() => copyValue("Hex", hexValue)}
      >
        {#if copied === "Hex"}
          <IconCheck aria-hidden="true" size={16} stroke={2} />
        {:else}
          <IconCopy aria-hidden="true" size={16} stroke={2} />
        {/if}
      </button>
    </div>
  </div>

  <div class="grid gap-1">
    <label class="text-[0.7rem] font-bold tracking-[0.08em] uppercase" for="rgb-color-value">RGB</label>
    <div class="flex items-center border-b border-current">
      <input
        class="w-[16ch] min-w-0 rounded-none border-0 bg-transparent py-1 font-inherit text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        id="rgb-color-value"
        aria-label="RGB color value"
        value={rgbValue}
        oninput={updateRgb}
      />
      <button
        class="grid cursor-pointer border-0 bg-transparent py-[0.2rem] pr-0 pl-[0.4rem] text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        type="button"
        aria-label="Copy RGB value"
        onclick={() => copyValue("RGB", rgbValue)}
      >
        {#if copied === "RGB"}
          <IconCheck aria-hidden="true" size={16} stroke={2} />
        {:else}
          <IconCopy aria-hidden="true" size={16} stroke={2} />
        {/if}
      </button>
    </div>
  </div>

  {#if oklch}
    <div class="grid gap-1">
      <label class="text-[0.7rem] font-bold tracking-[0.08em] uppercase" for="oklch-color-value">OKLCH</label>
      <div class="flex items-center border-b border-current">
        <input
          class="w-[28ch] min-w-0 rounded-none border-0 bg-transparent py-1 font-inherit text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
          id="oklch-color-value"
          aria-label="OKLCH color value"
          value={oklchValue}
          oninput={updateOklch}
        />
        <button
          class="grid cursor-pointer border-0 bg-transparent py-[0.2rem] pr-0 pl-[0.4rem] text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
          type="button"
          aria-label="Copy OKLCH value"
          onclick={() => copyValue("OKLCH", oklchValue)}
        >
          {#if copied === "OKLCH"}
            <IconCheck aria-hidden="true" size={16} stroke={2} />
          {:else}
            <IconCopy aria-hidden="true" size={16} stroke={2} />
          {/if}
        </button>
      </div>
    </div>
  {/if}
</section>

<p class="sr-only" aria-atomic="true" aria-live="polite">
  {copied ? `${copied} value copied.` : ""}
</p>
