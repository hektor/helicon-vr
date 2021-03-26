<script>
  import TransportControls from '../components/transport-controls.svelte'
  import ToggleTheme from '../components/toggle-theme.component.svelte'
  import ChannelStrip from '../components/channel-strip.component.svelte'
  import AddFilled24 from 'carbon-icons-svelte/lib/AddFilled24'
  import { onDestroy } from 'svelte'
  import * as Tone from 'tone'
  import { Transport } from 'tone'
  import { playing$, bpm$ } from '../stores/playback'
  import { vol$, mute$ } from '../stores/playback'
  import { tracks$ } from '../stores/mixer'

  const newTrack = () =>
    tracks$.next([
      ...$tracks$,
      { id: $tracks$.length + 1, label: `Track ${$tracks$.length + 1}`, volume: -60, mute: false },
    ])

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
    <div class="tracks">
      {#each $tracks$ as { label, volume, mute }}
        <ChannelStrip {label} bind:volume bind:mute />
      {/each}
    </div>
    <button class="channel-strip-add" on:click={newTrack}>
      <AddFilled24 style="fill: var(--color-2)" />
      <small> New track </small>
    </button>
    <ChannelStrip
      label="Master"
      mute={$mute$}
      bind:volume={$vol$}
      on:mute={() => mute$.next(!$mute$)}
      master
    />
  </div>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .channel-strips {
    min-width: 9.6rem;
    max-width: 100vw;
    margin-top: auto;
    display: flex;
    padding: 1.6rem 1.6rem;
    padding-right: 4rem;
  }

  .channel-strip-add {
    min-width: 9.6rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.6rem;
    border-left: 1px solid var(--color-1);
  }

  .tracks::-webkit-scrollbar {
    width: 5px;
    height: 0.8rem;
    background-color: transparent;
    border-bottom: 1px solid var(--color-1);
  }

  .tracks::-webkit-scrollbar-thumb {
    background: var(--color-3);
  }

  .tracks {
    flex: 8;
    display: flex;
    overflow-x: scroll;
  }

  .channel-strip-add > small {
    padding: 0.8rem 0;
    color: var(--color-2);
  }

  :global(.master) {
    flex: 1;
    margin-left: auto;
    padding-left: 3.2rem;
    border-left: 1px solid var(--color-1);
  }
</style>
