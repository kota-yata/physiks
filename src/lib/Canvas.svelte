<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { Ops } from '$lib/Shape';

  let canvas: HTMLCanvasElement;
  let ops: Ops;

  let score = 0;

  const highScore = localStorage.getItem('best') || '0';

  const dispatch = createEventDispatcher();

  // Move rectangle every frame
  const loop = () => {
    ops.context.clearRect(0, 0, canvas.width, canvas.height);
    const isContinue = ops.collide();
    if (!isContinue) {
      dispatch('over', {
        score: ops.score
      });
      return;
    }
    ops.move();
    ops.draw();
    score = ops.score;
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

<section>
  <canvas bind:this={canvas} />
  <p class="score">
    Score: {score}<br />
    High Score: {highScore}
  </p>
</section>

<style lang="scss">
  @import '../styles/tarrget.scss';
  section {
    canvas {
      width: 100%;
      height: 100%;
    }
    .score {
      position: fixed;
      top: 10px;
      left: 10px;
      font-family: $tarrget;
    }
  }
</style>
