<script>
  import TransportControls from '../components/transport-controls.svelte'
  import VolumeSlider from '../components/volume-slider.component.svelte'
  import { onDestroy } from 'svelte'
  import * as Tone from 'tone'
  import { Transport } from 'tone'
  import { playing$, bpm$ } from '../stores/playback'

  const gain = new Tone.Gain(0.1).toDestination()
  const synth = new Tone.Synth({ envelope: { attack: 0.25 } }).connect(gain)

  let oscType = 'square'

  /*
   * Configure synths
   */

  const sequencer = new Tone.Loop(time => {
    synth.triggerAttackRelease('C3', 1, time)
    synth.triggerAttackRelease('G3', 2, '+1n')
  }, '1m')

  const cMaj = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', null, null]
  const cycle = [
    cMaj[Math.round(Math.random(cMaj.length - 1))],
    null,
    cMaj[Math.round(Math.random(cMaj.length - 1))],
    null,
    cMaj[Math.round(Math.random(cMaj.length - 1))],
    null,
    cMaj[Math.round(Math.random(cMaj.length - 1))],
    null,
    cMaj[Math.round(Math.random(cMaj.length - 1))],
    null,
    cMaj[Math.round(Math.random(cMaj.length - 1))],
    cMaj[Math.round(Math.random(cMaj.length - 1))],
  ]

  let index = 0

  const loop = time => {
    let step = index % cycle.length
    let input = cycle[step]
    if (input !== null) synth.triggerAttackRelease(cycle[step], '32n', time)
    index++
  }

  $: synth.oscillator.type = oscType

  Tone.Transport.bpm.value = 80
  Tone.Transport.scheduleRepeat(loop, '8n')

  /*
   * Tone.start() prevents suspended AudioContext
   */
  $: $playing$ ? Tone.start() && Transport.start() : Transport.stop()
  $: Transport.bpm.value = $bpm$

  onDestroy(() => Transport.stop())
</script>

<div class="container">
  <h1>Test page</h1>
  <TransportControls />
  <VolumeSlider />
  <select bind:value={oscType}>
    <option value="sine">Sine</option>
    <option value="square">Square</option>
    <option value="triangle">Triangle</option>
  </select>
</div>

<style>
  .container {
    flex: 1;
  }
</style>
