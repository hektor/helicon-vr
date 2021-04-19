<script>
  export let synth

  import EnvelopeSettings from '../components/envelope-settings.component.svelte'
  import OscillatorSettings from '../components/oscillator-settings.component.svelte'
</script>

<div class="modules">
  <EnvelopeSettings bind:envelope={synth.envelope} bind:portamento={synth.portamento} />
  <OscillatorSettings bind:oscillator={synth.oscillator} />
</div>

<style>
  .modules {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
</style>
