<script>
  import { synth$ } from '../stores/synths'
  import RangeSlider from './range-slider.component.svelte'
</script>

<div class="oscillator">
  <h2>Oscillator</h2>
  <div class="action-group">
    <select bind:value={$synth$.oscillator.type}>
      <option value="sine"> Sine</option>
      <option value="square">Square</option>
      <option value="triangle">Triangle</option>
      <option value="fatsine">Fat sine</option>
      <option value="fatsquare">Fat square</option>
      <option value="fattriangle">Fat triangle</option>
      <option value="fatsawtooth">Fat sawtooth</option>
      <option value="sawtooth">Sawtooth</option>
      <option value="amsine">AM Sine</option>
      <option value="amsquare">AM Square</option>
      <option value="amtriangle">AM Triangle</option>
      <option value="amsawtooth">AM Sawtooth</option>
      <option value="fmsine">FM Sine</option>
      <option value="fmsquare">FM Square</option>
      <option value="fmtriangle">FM Triangle</option>
      <option value="fmsawtooth">FM Sawtooth</option>
    </select>
    <RangeSlider
      min={-60}
      max={6}
      step={0.01}
      label={`${$synth$.oscillator.volume}dB`}
      bind:value={$synth$.oscillator.volume}
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
</style>
