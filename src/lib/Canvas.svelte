<script lang="ts">
  import { onMount } from 'svelte';

  let canvasEl: HTMLCanvasElement;

  const canvas = {
    width: 1000,
    height: 1000
  };

  const drawRect = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.fillStyle = '#ffffff';
    context.rect(canvas.width * 0.5 - 20, canvas.height * 0.9, 40, 10);
    context.fill();
  };

  onMount(() => {
    console.log('Onmount');
    const context = canvasEl.getContext('2d');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    drawRect(context);
  });
</script>

<canvas bind:this={canvasEl} width={canvas.width} height={canvas.height} />

<style lang="scss">
  canvas {
		width: 100%;
		height: 100%;
	}
</style>
