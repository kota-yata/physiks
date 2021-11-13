<script lang="ts">
  import Canvas from '$lib/Canvas.svelte';
  import Result from '$lib/Result.svelte';
  import Start from '$lib/Start.svelte';
  let isStart = true;
  let isGame = false;
  const onStart = () => {
    isStart = false;
    isGame = true;
  };
  let score = 0;
  const gameOver = (event: { detail: { score: number } }) => {
    score = event.detail.score;
    isStart = isGame = false;
  };
</script>

<svelte:head>
  <title>Physiks</title>
</svelte:head>

{#if isStart}
  <Start on:start={onStart} />
{:else if isGame}
  <Canvas on:over={gameOver} />
{:else}
  <Result {score} />
{/if}
