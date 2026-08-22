<script lang="ts">
  import { ColorPicker, parseColor } from "@ark-ui/svelte/color-picker";

  let { value, oninput }: { value: string; oninput: (value: string) => void } =
    $props();

  const savedColors = [
    "#EF4444",
    "#F59E0B",
    "#EAB308",
    "#22C55E",
    "#14B8A6",
    "#06B6D4",
    "#3B82F6",
    "#8B5CF6",
    "#D946EF",
    "#EC4899",
  ];
</script>

<ColorPicker.Root
  value={parseColor(value)}
  name="selected-color"
  positioning={{ placement: "bottom", gutter: 12 }}
  onValueChange={(details) => oninput(details.value.toString("hex"))}
>
  <ColorPicker.Label class="sr-only">Selected color</ColorPicker.Label>
  <ColorPicker.Control class="flex items-center justify-center">
    <ColorPicker.Trigger
      class="group flex min-h-12 items-center gap-3 rounded-full border border-current/25 bg-black/10 py-1.5 pr-5 pl-1.5 shadow-[0_1px_0_rgb(255_255_255_/_0.18)_inset,0_10px_24px_rgb(0_0_0_/_0.12)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:bg-black/15 focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
    >
      <ColorPicker.ValueSwatch
        class="h-9 w-9 rounded-full border-2 border-white/85 shadow-[0_0_0_2px_rgb(0_0_0_/_0.16)]"
      />
      <span class="text-xs font-bold tracking-[0.12em] uppercase">
        Tune color
      </span>
      <span
        class="grid h-5 w-5 place-items-center rounded-full border border-current/30 text-sm leading-none transition-transform duration-200 group-data-[state=open]:rotate-45"
        aria-hidden="true">+</span
      >
    </ColorPicker.Trigger>
  </ColorPicker.Control>

  <ColorPicker.Positioner>
    <ColorPicker.Content
      class="color-picker-panel w-[min(calc(100vw-1.5rem),22rem)] rounded-[1.35rem] border border-white/15 bg-[#141414]/95 p-3.5 text-[#f5f2ed] shadow-[0_24px_60px_rgb(0_0_0_/_0.42),0_1px_0_rgb(255_255_255_/_0.12)_inset] backdrop-blur-xl data-[state=closed]:animate-none"
    >
      <div class="mb-3 flex items-center justify-between px-1">
        <span class="text-[0.65rem] font-bold tracking-[0.16em] text-white/55 uppercase">
          Color studio
        </span>
        <ColorPicker.ValueText class="font-medium text-sm tabular-nums" />
      </div>

      <ColorPicker.Area class="relative aspect-[1.35] cursor-crosshair overflow-hidden rounded-xl shadow-[0_0_0_1px_rgb(255_255_255_/_0.14)_inset]">
        <ColorPicker.AreaBackground class="!absolute !inset-0" />
        <ColorPicker.AreaThumb class="h-4 w-4 rounded-full border-2 border-white shadow-[0_0_0_2px_rgb(0_0_0_/_0.48)]" />
      </ColorPicker.Area>

      <div class="mt-4 space-y-3">
        <div class="flex items-center gap-3">
          <span class="w-8 text-[0.65rem] font-bold tracking-[0.12em] text-white/55 uppercase">Hue</span>
          <ColorPicker.ChannelSlider channel="hue" class="relative h-4 flex-1 cursor-ew-resize">
            <ColorPicker.ChannelSliderTrack class="h-2 rounded-full shadow-[0_0_0_1px_rgb(255_255_255_/_0.14)]" />
            <ColorPicker.ChannelSliderThumb class="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-transparent shadow-[0_0_0_2px_rgb(0_0_0_/_0.55)]" />
          </ColorPicker.ChannelSlider>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-[auto_1fr] items-center gap-3">
        <ColorPicker.ValueSwatch class="h-11 w-11 rounded-lg border border-white/20 shadow-[0_1px_0_rgb(255_255_255_/_0.14)_inset]" />
        <ColorPicker.ChannelInput
          channel="hex"
          class="h-11 w-full rounded-lg border border-white/15 bg-white/[0.07] px-3 font-inherit text-sm tracking-[0.04em] text-white outline-none transition placeholder:text-white/35 focus:border-white/50 focus:bg-white/[0.11]"
        />
      </div>

      <div class="mt-4 border-t border-white/10 pt-3.5">
        <p class="mb-2.5 text-[0.65rem] font-bold tracking-[0.14em] text-white/55 uppercase">
          Saved colors
        </p>
        <ColorPicker.SwatchGroup class="grid grid-cols-10 gap-1.5">
          {#each savedColors as savedColor (savedColor)}
            <ColorPicker.SwatchTrigger
              value={savedColor}
              class="group/swatch relative aspect-square rounded-full outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
              aria-label={`Choose ${savedColor}`}
            >
              <ColorPicker.Swatch
                value={savedColor}
                class="block h-full w-full rounded-full border border-white/25 shadow-[0_1px_2px_rgb(0_0_0_/_0.3)]"
              >
                <ColorPicker.SwatchIndicator class="absolute inset-0 grid place-items-center text-[0.65rem] font-bold text-white drop-shadow-[0_1px_1px_rgb(0_0_0_/_0.8)]">
                  ✓
                </ColorPicker.SwatchIndicator>
              </ColorPicker.Swatch>
            </ColorPicker.SwatchTrigger>
          {/each}
        </ColorPicker.SwatchGroup>
      </div>

      <ColorPicker.HiddenInput />
    </ColorPicker.Content>
  </ColorPicker.Positioner>
</ColorPicker.Root>

<style>
  :global(.color-picker-panel [data-part="channel-slider-track"]) {
    background: linear-gradient(
      to right,
      #f00 0%,
      #ff0 17%,
      #0f0 33%,
      #0ff 50%,
      #00f 67%,
      #f0f 83%,
      #f00 100%
    );
  }
</style>
