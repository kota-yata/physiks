<script lang="ts">
  import Canvas from '$lib/Canvas.svelte';

  export const prerender = true;
  export const hydrate = false;
</script>

<svelte:head>
  <title>Temp</title>
</svelte:head>

<Canvas />
