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

<section class="mt-10 text-center" aria-labelledby="named-match-heading">
  <p
    class="m-0 text-[clamp(0.7rem,1.8vw,0.82rem)] leading-[1.6] tracking-[0.04em] uppercase"
    id="named-match-heading"
  >
    Named-color match
  </p>
  <p
    class="my-[0.45rem] break-words text-[clamp(1.8rem,7vw,4.5rem)] font-bold leading-[0.96] tracking-[-0.08em]"
  >
    {name}
  </p>
  <button
    class="mt-6 cursor-pointer border-0 border-b border-current bg-transparent p-0 text-inherit focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4 disabled:invisible"
    type="button"
    onclick={onswitch}
    disabled={isExactMatch}
  >
    Switch to match
  </button>
</section>
