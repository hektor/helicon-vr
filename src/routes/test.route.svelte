<script>
  import { onDestroy } from 'svelte'
  import * as Tone from 'tone'
  import { Channel, Transport, Synth, start } from 'tone'
  import Header from '../components/header.component.svelte'

  import TransportControls from '../components/transport-controls.svelte'
  import EnvelopeSettings from '../components/envelope-settings.component.svelte'
  import OscillatorSettings from '../components/oscillator-settings.component.svelte'
  import MIDIDevices from '../components/midi-devices.component.svelte'
  import MIDIEvents from '../components/midi-events.component.svelte'
  import MIDINotes from '../components/midi-notes.component.svelte'
  import Piano from '../components/piano.component.svelte'

  import { playing$ } from '../stores/playback'
  import { bpm$ } from '../stores/playback'
  import { master$ } from '../stores/mixer'
  import { synths$ } from '../stores/synths'

  const context = new Tone.Context({ latencyHint: 'interactive' })
  /* Tone.context.lookAhead = 0 */
  Tone.setContext(context)
  const now = () => Tone.now()

  const master = new Channel($master$).toDestination()
  const synth = new Synth($synths$.synths[0]).toDestination(master)

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
    synth.set($synths$.synths[0])
    // Calling Tone.start() prevents suspended AudioContext
    $playing$ ? start() && Transport.start() : Transport.stop()
    Transport.bpm.value = $bpm$
  }

  const midiMessageToNoteName = msg => Tone.Frequency(msg[1], 'midi')

  const handleNoteOn = ({ detail }) => synth.triggerAttack(midiMessageToNoteName(detail), now())
  const handleNoteOff = () => synth.triggerRelease(now())

  onDestroy(() => Transport.stop())
</script>

<div class="container">
  <Header>
    <TransportControls />
    <MIDIDevices />
  </Header>
  <div class="modules">
    <EnvelopeSettings />
    <OscillatorSettings />
  </div>
  <MIDIEvents />
  <MIDINotes on:noteon={handleNoteOn} on:noteoff={handleNoteOff} />
  <Piano on:noteon={handleNoteOn} on:noteoff={handleNoteOff} />
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
