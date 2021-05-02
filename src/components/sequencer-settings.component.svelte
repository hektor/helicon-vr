<script>
  import ControlKnob from './control-knob.component.svelte'

  import * as Tone from 'tone'

  const getNote = num => Tone.Frequency(num, 'midi').toNote()

  export let cycles = []
</script>

<div class="sequencer">
  {#each cycles as { steps, pulses, note }, i}
    <div class="cycle">
      <span>Cycle {i + 1}</span>
      <div class="cycle-setting">
        <ControlKnob bind:value={steps} min={3} max={16} />
        <label for="steps">Positions</label>
      </div>
      <div class="cycle-setting">
        <ControlKnob bind:value={pulses} min={0} max={steps} />
        <label for="pulses">Pulses</label>
      </div>
      <div class="cycle-setting">
        <ControlKnob bind:value={note} min={0} max={127} />
        <label for="note">{getNote(note)}</label>
      </div>
    </div>
  {/each}
</div>

<style>
  .sequencer {
    display: flex;
    padding: 1.6rem;
  }

  .cycle {
    display: flex;
    flex-direction: column;
  }

  .cycle > span {
    padding: 1.6rem;
    text-align: center;
  }

  .cycle-setting {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.8rem;
    border: 1px solid var(--color-1);
    border-width: 0 1px;
    margin-right: -1px;
    margin-top: -1px;
  }

  .cycle-setting:nth-child(2) {
    border-top-width: 1px;
  }

  .cycle-setting:last-child {
    border-bottom-width: 1px;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid var(--color-1);
    padding: 1.6rem;
  }
</style>
