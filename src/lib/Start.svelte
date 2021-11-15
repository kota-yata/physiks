<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.code !== 'Space') return;
    e.preventDefault();
    dispatch('start');
  });
</script>

<section>
  <h1>Physiks</h1>
  <p>Press space to start</p>
</section>

<style lang="scss">
  @import '../styles/tarrget.scss';

  section {
    & > h1 {
      font-size: 100px;
      font-family: $tarrget;
    }
    & > p {
      font-size: 30px;
      font-family: $tarrget;
    }
  }
</style>
