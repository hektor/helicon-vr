<script>
  import TransportControls from '../components/transport-controls.svelte'
  import VolumeSlider from '../components/volume-slider.component.svelte'
  import ToggleTheme from '../components/toggle-theme.component.svelte'
  import { onDestroy } from 'svelte'
  import * as Tone from 'tone'
  import { Transport } from 'tone'
  import { playing$, bpm$ } from '../stores/playback'
  import { vol$, mute$ } from '../stores/playback'

  const master = new Tone.Channel({
    volume: -Infinity,
  }).toDestination()

  const synth = new Tone.Synth({ envelope: { attack: 0.25 } }).connect(master)

  /*
   * Playback store updates
   */

  $: {
    master.set({ volume: $vol$, mute: $mute$ })
    // Calling Tone.start() prevents suspended AudioContext
    $playing$ ? Tone.start() && Transport.start() : Transport.stop()
    Transport.bpm.value = $bpm$
  }

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

  Tone.Transport.scheduleRepeat(loop, '8n')

  $: synth.oscillator.type = oscType

  onDestroy(() => Transport.stop())
</script>

<div class="container">
  <header>
    <TransportControls />
  </header>
  <ToggleTheme />
  <select bind:value={oscType}>
    <option value="sine">Sine</option>
    <option value="square">Square</option>
    <option value="triangle">Triangle</option>
  </select>
  <div class="channel-strips">
    <div class="channel-strip">
      <VolumeSlider label="Track 1" />
      <button class="channel-mute">M</button>
    </div>
    <div class="channel-strip master">
      <VolumeSlider label="Master" bind:value={$vol$} mute={$mute$} />
      <button class="channel-mute" class:mute={$mute$} on:click={() => mute$.next(!$mute$)}>
        M
      </button>
    </div>
  </div>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .channel-strip {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .channel-strips {
    margin-top: auto;
    display: flex;
    padding: 1.6rem 6.4rem;
  }

  .master {
    margin-left: auto;
  }

  .channel-mute {
    margin: 1rem;
    padding: 1rem;
    color: var(--color-3);
    border: 1px solid var(--color-1);
    background: var(--color-bg);
  }

  .mute {
    color: var(--color-bg);
    border: 1px solid var(--color-bg);
    background: var(--color-primary);
  }
</style>
