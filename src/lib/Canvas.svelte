<script lang="ts">
  import { onMount } from 'svelte';
  import { Ops } from '$lib/Shape';

  let canvas: HTMLCanvasElement;
  let ops: Ops;

  // Move rectangle every frame
  const loop = () => {
    ops.context.clearRect(0, 0, canvas.width, canvas.height);
    ops.collide();
    ops.move();
    ops.draw();
    requestAnimationFrame(loop);
  };
  const triggerKeydownEvents = (event: KeyboardEvent) => {
    if (ops.keys[event.code] === undefined) return;
    ops.keys[event.code] = event.type === 'keydown';
    event.preventDefault();
  };

  onMount(() => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    // Move ops with keyboard
    ops = new Ops(canvas);
    ops.draw();
    window.addEventListener('keydown', triggerKeydownEvents);
    window.addEventListener('keyup', triggerKeydownEvents);
    loop();
  });
</script>

<canvas bind:this={canvas} />

<style lang="scss">
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
