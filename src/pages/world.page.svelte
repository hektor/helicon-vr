<script>
  import Scene from '../components/scene.component.svelte'
  import TrashCan24 from 'carbon-icons-svelte/lib/TrashCan24'
  import { onDestroy } from 'svelte'
  import * as Tone from 'tone'
  import { Transport, Channel, Synth } from 'tone'

  import { playing$, bpm$, vol$, mute$ } from '../stores/playback'
  import { tracks$ } from '../stores/mixer'

  import TransportControls from '../components/transport-controls.svelte'
  import ToggleTheme from '../components/toggle-theme.component.svelte'
  import ChannelStrip from '../components/channel-strip.component.svelte'
  import AddTrack from '../components/add-track.component.svelte'

  /*
   * Add a track
   */

  const addTrack = () =>
    tracks$.next([
      ...$tracks$,
      { id: $tracks$.length + 1, label: `Track ${$tracks$.length + 1}`, volume: 0, mute: false },
    ])

  /*
   * Remove track from its context menu,
   * other tracks are reindexed and relabeled
   */

  const removeTrack = () => {
    tracks$.next(
      $tracks$
        // remove
        .filter(({ id }) => id !== trackMenu)
        // reindex
        .map((track, i) => ({
          ...track,
          id: i + 1,
          label: `Track ${i + 1}`,
        })),
    )
    // reset menu id
    trackMenu = null
  }

  const master = new Channel({
    volume: -Infinity,
  }).toDestination()

  let channels = $tracks$.map(({ volume, mute, id }) =>
    new Channel({ volume, mute, id }).connect(master),
  )

  const indexChannels = () =>
    channels.map((channel, i) => {
      channel.name = $tracks$[i].id
    })

  indexChannels()

  $: {
    if ($tracks$.length > channels.length) {
      const channel = new Channel({ volume: 0, mute: false }).connect(master)
      channel.name = $tracks$.length
      channels = [...channels, channel]
    }
    if ($tracks$.length < channels.length) {
      const trackIds = $tracks$.map(({ id }) => id)
      const channelIds = channels.map(({ name }) => name)
      const diff = channelIds.filter(x => !trackIds.includes(x))
      channels.filter(channel => {
        if (diff.includes(channel.name)) {
          channel.dispose()
        }
      })

      channels = channels.filter(channel => !diff.includes(channel.name))
    }

    $tracks$.forEach(({ volume, mute }, i) => {
      channels[i].volume.value = volume
      channels[i].mute = mute
    })
  }

  const synth = new Synth({ envelope: { attack: 0.25 } }).connect(channels[0])

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

  let position = { x: 0, y: 0 }
  let shown = false
  let trackMenu = null

  const showMenu = (e, id) => {
    const { clientX: x, clientY: y } = e
    trackMenu = id
    shown = true
    position = { x, y }
  }

  const hideMenu = () => {
    shown = false
  }

  onDestroy(() => Transport.stop())
</script>

<div class="container">
  <header>
    <TransportControls>
      <span class="mode-title">Performance</span>
    </TransportControls>
  </header>
  <select bind:value={oscType}>
    <option value="sine">Sine</option>
    <option value="square">Square</option>
    <option value="triangle">Triangle</option>
  </select>
  <ToggleTheme />
  <Scene />
  <div class="channel-strips">
    <div class="tracks">
      {#each $tracks$ as { id, label, volume, mute }}
        <ChannelStrip
          {label}
          bind:volume
          bind:mute
          on:contextmenu={e => {
            showMenu(e, id)
          }}
        />
      {/each}
    </div>
    <AddTrack on:click={addTrack} />
    <ChannelStrip label="Master" bind:volume={$vol$} bind:mute={$mute$} master />
  </div>
</div>

{#if trackMenu}
  <div
    id="context"
    style="--display: {shown ? 'block' : 'none'}; --top: {position.y}px; --left: {position.x}px"
  >
    <ul>
      <li>
        <span>Track {trackMenu}</span>
      </li>
      <li class="option" on:click={removeTrack}><TrashCan24 />Remove</li>
    </ul>
  </div>
{/if}
<svelte:body on:click={hideMenu} on:contextmenu|preventDefault />

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

  :global(.master) {
    flex: 1;
    margin-left: auto;
    padding-left: 3.2rem;
    border-left: 1px solid var(--color-1);
  }

  #context {
    display: var(--display);
    border: 1px solid var(--color-3);
    background: var(--color-1);
    position: absolute;
    top: var(--top);
    left: var(--left);
  }

  #context span {
    font-weight: 500;
    background: var(--color-1);
  }

  #context ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  #context li {
    display: flex;
    align-items: center;
    padding: 1.6rem;
  }

  #context .option:hover {
    cursor: pointer;
    color: var(--color-1);
    background: var(--color-4);
  }

  .mode-title {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 1.6rem;
  }
</style>
