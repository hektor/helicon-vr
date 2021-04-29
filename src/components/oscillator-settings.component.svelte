<script>
  export let oscillator
  export let disabled = true

  import RangeSlider from './range-slider.component.svelte'

  const oscillators = [
    { name: 'Sine', value: 'sine' },
    { name: 'Square', value: 'square' },
    { name: 'Triangle', value: 'triangle' },
    { name: 'Fatsine', value: 'fatsine' },
    { name: 'Fatsquare', value: 'fatsquare' },
    { name: 'Fattriangle', value: 'fattriangle' },
    { name: 'Fatsawtooth', value: 'fatsawtooth' },
    { name: 'Sawtooth', value: 'sawtooth' },
    { name: 'AM Sine', value: 'amsine' },
    { name: 'AM Square', value: 'amsquare' },
    { name: 'AM Triangle', value: 'amtriangle' },
    { name: 'AM Sawtooth', value: 'amsawtooth' },
    { name: 'FM Sine', value: 'fmsine' },
    { name: 'FM Square', value: 'fmsquare' },
    { name: 'FM Triangle', value: 'fmtriangle' },
    { name: 'FM Sawtooth', value: 'fmsawtooth' },
  ]
</script>

<div class="oscillator">
  <h2>Oscillator</h2>
  <div class="action-group">
    <select {disabled} bind:value={oscillator.type}>
      {#each oscillators as { value, name }}
        <option {value}>{name}</option>
      {/each}
    </select>
    <RangeSlider
      min={-60}
      max={6}
      step={0.01}
      label={`${oscillator.volume}dB`}
      bind:value={oscillator.volume}
    />
  </div>
</div>

<style>
  .oscillator {
    padding: 1.6rem 0.8rem;
    border: 1px solid var(--color-1);
    margin-top: -1px;
    margin-left: -1px;
  }

  .oscillator h2 {
    color: var(--color-5);
    margin: 1.6rem 3.2rem;
  }

  .action-group {
    display: flex;
    padding: 1.6rem;
    flex-direction: column;
  }

  select {
    flex: 1;
  }

  select:disabled {
    color: var(--color-2);
    background: var(--color-1);
  }
</style>
