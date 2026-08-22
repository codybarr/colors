<script lang="ts">
    import { Field } from "@ark-ui/svelte/field";

    import { parseCssColor } from "$lib/color/color";

    let {
        value,
        oninput,
    }: { value: string; oninput: (value: string) => void } = $props();
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

<div class="picker-group">
    <Field.Root class="picker">
        <Field.Label>Selected color</Field.Label>
        <Field.Input
            name="selected-color"
            type="color"
            {value}
            oninput={selectNativeColor}
        />
    </Field.Root>
</div>
