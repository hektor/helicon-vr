<script>
  import { vol$ } from '../stores/playback'
  const max = 100
  const min = 0
</script>

<div>
  <input type="range" bind:value={$vol$} {min} {max} steps={max} />
</div>

<style>
  div {
    --height: 8rem;
    --width: 2.4rem;
    display: inline-block;
    width: var(--width);
    height: var(--height);
    padding: 0;
  }

  div {
    width: var(--height);
    height: var(--width);
    margin: 0;
    transform-origin: calc(var(--height) / 2) calc(var(--height) / 2);
    transform: rotate(-90deg);
  }
</style>
