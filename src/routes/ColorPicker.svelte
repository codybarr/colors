<script lang="ts">
  import { Field } from "@ark-ui/svelte/field";

  import { parseCssColor } from "$lib/color/color";

  let { value, oninput }: { value: string; oninput: (value: string) => void } =
    $props();
  let textValue = $derived(value);

  function selectNativeColor(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    textValue = input.value;
    oninput(input.value);
  }

  function updateTextColor(event: Event) {
    textValue = (event.currentTarget as HTMLInputElement).value;
    const color = parseCssColor(textValue);
    if (color) oninput(color.hex);
  }

  function selectTextColor() {
    const color = parseCssColor(textValue);
    if (color) oninput(color.hex);
  }

  function submitTextColor(event: KeyboardEvent) {
    if (event.key === "Enter") selectTextColor();
  }
</script>

<div class="flex flex-wrap items-end justify-center gap-4">
  <Field.Root class="flex flex-col items-center gap-2">
    <Field.Label class="text-xs font-bold tracking-[0.08em] uppercase">
      Selected color
    </Field.Label>
    <Field.Input
      class="h-11 w-11 cursor-pointer rounded-md border-2 border-current bg-current p-[0.18rem] [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-0 focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
      name="selected-color"
      type="color"
      {value}
      oninput={selectNativeColor}
    />
  </Field.Root>
</div>
