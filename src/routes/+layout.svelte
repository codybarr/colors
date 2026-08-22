<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap"
  />
</svelte:head>
{@render children()}
