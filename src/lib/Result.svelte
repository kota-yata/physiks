<script lang="ts">
  export let score: number;
  let isHighest = false;
  const best: string | null = localStorage.getItem('best');
  if (!best || parseInt(best) < score) {
    isHighest = true;
    localStorage.setItem('best', score.toString());
  }
</script>

<section>
  <h1>Game Over...</h1>
  <p>Score: {score}</p>
  {#if isHighest}
    <h3>High Score!!</h3>
  {/if}
  <a href="https://twitter.com/share?url=https://physiks.vercel.app&text={`I got ${score} points😆%0A`}&hashtags=PHYSIKS&related=@kota_yata" target="blank">
    <img alt="twitter icon" src="/twitter.svg" />
  </a>
</section>

<style lang="scss">
  @import '../styles/tarrget.scss';
  @import '../styles/variable.scss';

  section {
    & > h1 {
      font-size: 70px;
      font-family: $tarrget;
    }
    & > h3 {
      font-size: 40px;
      font-family: $tarrget;
      color: $blue;
    }
    & > p {
      font-size: 30px;
      font-family: $tarrget;
    }
  }
</style>
