<script>
  import { onDestroy } from 'svelte'
  import { Channel, Transport, Synth, start } from 'tone'
  import Header from '../components/header.component.svelte'

  import TransportControls from '../components/transport-controls.svelte'
  import EnvelopeSettings from '../components/envelope-settings.component.svelte'
  import OscillatorSettings from '../components/oscillator-settings.component.svelte'

  import { playing$ } from '../stores/playback'
  import { bpm$ } from '../stores/playback'
  import { master$ } from '../stores/mixer'
  import { synth$ } from '../stores/synths'

  const master = new Channel($master$).toDestination()
  const synth = new Synth($synth$).toDestination(master)

  const cycle = ['C4', null, 'E4', null]
  let index = 0
  const loop = time => {
    let step = index % cycle.length
    let input = cycle[step]
    input && synth.triggerAttackRelease(cycle[step], '32n', time)
    index++
  }
  Transport.scheduleRepeat(loop, '4n')

  $: {
    synth.set($synth$)
    // Calling Tone.start() prevents suspended AudioContext
    $playing$ ? start() && Transport.start() : Transport.stop()
    Transport.bpm.value = $bpm$
  }
  onDestroy(() => Transport.stop())
</script>

<div class="container">
  <Header>
    <TransportControls />
  </Header>
  <div class="modules">
    <EnvelopeSettings />
    <OscillatorSettings />
  </div>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .modules {
    flex: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
