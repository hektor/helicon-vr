<script>
  export let envelope
  export let portamento

  import ADSR from './adsr.component.svelte'
  import ControlKnob from './control-knob.component.svelte'
</script>

<div class="envelope">
  <h2>Envelope</h2>
  <ADSR bind:envelope />
  <div class="action-group">
    <div class="control-knob-container">
      <ControlKnob id="attack" min={0} max={2} step={0.02} bind:value={envelope.attack} />
      <label for="attack">Attack</label>
    </div>
    <div class="control-knob-container">
      <ControlKnob id="decay" min={0} max={2} step={0.02} bind:value={envelope.decay} />
      <label for="decay">Decay</label>
    </div>
    <div class="control-knob-container">
      <ControlKnob id="sustain" min={0} max={1} step={0.01} bind:value={envelope.sustain} />
      <label for="sustain">Sustain</label>
    </div>
    <div class="control-knob-container">
      <ControlKnob id="release" min={0} max={5} step={0.05} bind:value={envelope.release} />
      <label for="release">Release</label>
    </div>
    <hr />
    <div class="control-knob-container">
      <ControlKnob id="portamento" min={0} max={5} step={0.05} bind:value={portamento} />
      <label for="portamento">Portamento</label>
    </div>
  </div>
</div>

<style>
  .envelope {
    padding: 1.6rem 0.8rem;
    border: 1px solid var(--color-1);
    margin-top: -1px;
    margin-left: -1px;
  }

  .envelope h2 {
    color: var(--color-5);
    margin: 1.6rem 3.2rem;
  }

  .action-group {
    display: flex;
    padding: 1.6rem;
  }

  .control-knob-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.8rem;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid var(--color-1);
    padding: 1.6rem;
  }
</style>
