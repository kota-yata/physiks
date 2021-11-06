<script lang="ts">
  import { onMount } from 'svelte';
  import { Ops } from '$lib/Shape';

  let canvas: HTMLCanvasElement;
  let ops: Ops;

  // Move rectangle every frame
  const FRAME_RATE = 60;
  const loop = (frameCount = 0) => {
    if (frameCount % (60 / FRAME_RATE) === 0) {
      ops.context.clearRect(0, 0, canvas.width, canvas.height);
      ops.move();
      ops.draw();
    }
    const count = frameCount + 1;
    requestAnimationFrame(() => { loop(count) });
  }
  const triggerKeydownEvents = (event: KeyboardEvent) => {
    if (ops.keys[event.code] === undefined) return;
    ops.keys[event.code] = event.type === "keydown";
    event.preventDefault();
  }

  onMount(() => {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    // Move ops with keyboard
    ops = new Ops(canvas);
    ops.draw();
    window.addEventListener('keydown', triggerKeydownEvents);
    window.addEventListener('keyup', triggerKeydownEvents);
    loop();
    // Draw circle
  });
</script>

<canvas bind:this={canvas}/>

<style lang="scss">
  canvas {
		width: 100%;
		height: 100%;
	}
</style>
