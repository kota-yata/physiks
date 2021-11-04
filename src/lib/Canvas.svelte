<script lang="ts">
  import { onMount } from 'svelte';

  const canvas = {
    context: null as CanvasRenderingContext2D,
    width: 0,
    height: 0
  };

  const drawRect = () => {
    canvas.context.beginPath();
    canvas.context.fillStyle = 'white';
    canvas.context.fillRect(canvas.width * 0.5 - 20, canvas.height * 0.9, 40, 10);
  };

  onMount(() => {
    console.log('Onmount');
    const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.context = canvasEl.getContext('2d');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    drawRect();
  });
</script>

<canvas id="canvas" width={canvas.width} height={canvas.height} />
