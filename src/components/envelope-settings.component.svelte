<script>
  import { synths$ } from '../stores/synths'
  import ADSR from './adsr.component.svelte'
  import ControlKnob from './control-knob.component.svelte'
</script>

<div class="envelope">
  <h2>Envelope</h2>
  <ADSR bind:envelope={$synths$.synths[0].envelope} />
  <div class="action-group">
    <fieldset>
      <ControlKnob
        id="attack"
        min={0}
        max={2}
        step={0.02}
        bind:value={$synths$.synths[0].envelope.attack}
      />
      <label for="attack">Attack</label>
    </fieldset>
    <fieldset>
      <ControlKnob
        id="decay"
        min={0}
        max={2}
        step={0.02}
        bind:value={$synths$.synths[0].envelope.decay}
      />
      <label for="decay">Decay</label>
    </fieldset>
    <fieldset>
      <ControlKnob
        id="sustain"
        min={0}
        max={1}
        step={0.01}
        bind:value={$synths$.synths[0].envelope.sustain}
      />
      <label for="sustain">Sustain</label>
    </fieldset>
    <fieldset>
      <ControlKnob
        id="release"
        min={0}
        max={5}
        step={0.05}
        bind:value={$synths$.synths[0].envelope.release}
      />
      <label for="release">Release</label>
    </fieldset>
    <hr />
    <fieldset>
      <ControlKnob
        id="portamento"
        min={0}
        max={5}
        step={0.05}
        bind:value={$synths$.synths[0].portamento}
      />
      <label for="portamento">Portamento</label>
    </fieldset>
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

  fieldset {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;
  }

  label {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid var(--color-1);
    padding: 1.6rem;
  }
</style>
