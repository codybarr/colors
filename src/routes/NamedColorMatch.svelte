<script lang="ts">
let {
  name,
  hex,
  family,
  isExactMatch,
  onswitch,
}: {
  name: string;
  hex: string;
  family: string;
  isExactMatch: boolean;
  onswitch: () => void;
} = $props();
</script>

<section class="w-full max-w-168 text-center" aria-label="Named-color match">
  <p
    class="m-0 text-[clamp(0.7rem,1.8vw,0.82rem)] leading-[1.6] tracking-[0.04em] uppercase"
    id="named-match-heading"
  >
    {isExactMatch ? "Exact match" : "Closest named color"}
  </p>
  <p
    class="my-4 text-3xl font-bold leading-tight wrap-anywhere sm:text-5xl"
  >
    {name}
  </p>
  <p class="mt-0 mb-3 text-lg font-bold" data-testid="match-color-family">
    <span class="text-xs font-normal">Color family:</span> {family}
  </p>
  <p class="m-0 text-sm tabular-nums">{hex}</p>
  <button
    class="mt-6 cursor-pointer border-0 border-b border-current bg-transparent p-0 text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4 disabled:invisible"
    type="button"
    onclick={onswitch}
    disabled={isExactMatch}
  >
    Use named color
  </button>
</section>
