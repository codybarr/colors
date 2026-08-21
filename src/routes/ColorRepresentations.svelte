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

<section class="representations" aria-label="Color representations">
	<div class="representation representation--hex">
		<label for="hex-color-value">Hex</label>
		<div class="representation-control">
			<input
				id="hex-color-value"
				aria-label="Hex color value"
				value={hexValue}
				oninput={updateHex}
			/>
			<button
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

	<div class="representation representation--rgb">
		<label for="rgb-color-value">RGB</label>
		<div class="representation-control">
			<input
				id="rgb-color-value"
				aria-label="RGB color value"
				value={rgbValue}
				oninput={updateRgb}
			/>
			<button
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
		<div class="representation representation--oklch">
			<label for="oklch-color-value">OKLCH</label>
			<div class="representation-control">
				<input
					id="oklch-color-value"
					aria-label="OKLCH color value"
					value={oklchValue}
					oninput={updateOklch}
				/>
				<button
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

<p class="copy-announcement" aria-atomic="true" aria-live="polite">
	{copied ? `${copied} value copied.` : ""}
</p>
