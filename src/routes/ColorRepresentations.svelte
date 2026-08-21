<script lang="ts">
let { hex, rgb, oklch }: { hex: string; rgb: string; oklch: string | null } =
	$props();
</script>

<p class="representations" aria-label="Color representations">
	<span>{hex}</span>
	<span>{rgb}</span>
	{#if oklch}<span>{oklch}</span>{/if}
</p>
