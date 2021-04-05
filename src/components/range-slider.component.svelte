<script>
  export let min = 0
  export let max = 100
  export let step = 1
  export let label = null
  export let value = ''
</script>

<div class="input">
  <input name="slider" type="range" {min} {max} {step} bind:value list="zero-snap" />
  <datalist id="zero-snap"><option value="0" /></datalist>
  {#if label !== null}<label for="slider">{label}</label>{/if}
</div>

<style>
  .input {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-height: 6.4rem;
    margin: 1.6rem 0;
  }

  label {
    color: var(--color-5);
    position: relative;
    top: -2.2rem;
    pointer-events: none;
  }

  input[type='range']::-webkit-slider-runnable-track {
    cursor: pointer;
    background: var(--color-1);
  }

  input[type='range'] {
    -webkit-appearance: none;
  }

  input[type='range']::-webkit-slider-thumb {
    background: var(--color-primary);
    height: 3.2rem;
    width: 0.4rem;
    cursor: pointer;
    -webkit-appearance: none;
  }
</style>
