<script>
  export let min = -60
  export let max = 6
  export let label
  export let value
  export let muted
</script>

<div class="slider-container" style="--muted: {muted ? 0.5 : 1}">
  <label for="slider">{label || ''}</label>
  <div class="slider">
    <input name="slider" type="range" bind:value {min} {max} steps={max} list="zero-snap" />
    <datalist id="zero-snap"><option value="0" /></datalist>
  </div>
  <span>{value}dB</span>
</div>

<style>
  label {
    padding: 0.8rem;
    border-bottom: 1px solid var(--color-1);
    overflow: hidden;
    max-width: 9.6rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .slider-container {
    display: flex;
    flex-direction: column;
    max-width: 8rem;
    align-items: center;
    opacity: var(--muted);
  }

  .slider {
    --height: 9.6rem;
    --width: 2.4rem;
    width: var(--width);
    height: var(--height);
    margin: 0.8rem;
  }

  input {
    width: var(--height);
    height: var(--width);
    transform-origin: calc(var(--height) / 2) calc(var(--height) / 2);
    transform: rotate(-90deg);
  }

  input[type='range']::-webkit-slider-runnable-track {
    cursor: pointer;
    background: var(--color-1);
  }

  input[type='range'] {
    -webkit-appearance: none;
  }

  input[type='range']::-webkit-slider-thumb {
    height: var(--width);
    width: 0.4rem;
    background: var(--color-primary);
    cursor: pointer;
    -webkit-appearance: none;
  }
</style>
