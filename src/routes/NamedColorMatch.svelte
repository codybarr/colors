<script lang="ts">
let {
	name,
	hex,
	isExactMatch,
	onswitch,
}: {
	name: string;
	hex: string;
	isExactMatch: boolean;
	onswitch: () => void;
} = $props();
</script>

<section class="match" aria-labelledby="named-match-heading">
	<p class="eyebrow" id="named-match-heading">Named-color match</p>
	<p class="match-name">{name}</p>
	<p class="match-status">{isExactMatch ? 'Exact named-color match' : `Matched hex: ${hex}`}</p>
	<button
		type="button"
		onclick={onswitch}
		disabled={isExactMatch}
		class:match-button-placeholder={isExactMatch}
	>
		Switch to match
	</button>
</section>
