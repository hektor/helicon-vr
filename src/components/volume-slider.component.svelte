<script>
  export let min = -60
  export let max = 6
  export let label
  export let value
</script>

<div class="slider-container">
  <label for="master">{label || ''}</label>
  <div class="slider">
    <input name="master" type="range" bind:value {min} {max} steps={max} list="zero-snap" />
    <datalist id="zero-snap"><option value="0" /></datalist>
  </div>
  <span>{value}dB</span>
</div>

<style>
  label {
    padding: 0.8rem;
    margin-bottom: 0.8rem;
    border-bottom: 1px solid #ccc;
  }

  .slider-container {
    display: flex;
    flex-direction: column;
    max-width: 8rem;
    align-items: center;
  }

  .slider {
    --height: 9.6rem;
    --width: 2.4rem;
    display: inline-block;
    width: var(--width);
    height: var(--height);
    padding: 0;
  }

  input {
    width: var(--height);
    height: var(--width);
    margin: 0;
    transform-origin: calc(var(--height) / 2) calc(var(--height) / 2);
    transform: rotate(-90deg);
  }

  input[type='range']::-webkit-slider-runnable-track {
    cursor: pointer;
    background: #ccc;
  }

  input[type='range']::-webkit-slider-thumb {
    cursor: pointer;
    background: #111;
  }

  input[type='range'] {
    -webkit-appearance: none;
  }

  input[type='range']::-webkit-slider-thumb {
    height: var(--width);
    width: 0.4rem;
    background: #555;
    cursor: pointer;
    -webkit-appearance: none;
  }
</style>
