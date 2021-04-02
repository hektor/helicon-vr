<script>
  import Scene from '../components/scene.component.svelte'
  import TrashCan24 from 'carbon-icons-svelte/lib/TrashCan24'
  import { onDestroy } from 'svelte'
  import * as Tone from 'tone'
  import { Transport, Channel, Synth } from 'tone'

  import { diff } from '../lib/array'

  import { playing$, bpm$ } from '../stores/playback'
  import { master$, tracks$, selected$ } from '../stores/mixer'
  import { synth$ } from '../stores/synths'

  import Header from '../components/header.component.svelte'
  import TransportControls from '../components/transport-controls.svelte'
  import MIDIDevices from '../components/midi-devices.component.svelte'
  import ToggleTheme from '../components/toggle-theme.component.svelte'
  import ChannelStrip from '../components/channel-strip.component.svelte'
  import AddTrack from '../components/add-track.component.svelte'

  // Menu
  let position = { x: 0, y: 0 }
  let shown = false
  let menuTrackId = null
  const setMenuTrackId = id => (menuTrackId = id)
  const showMenu = () => (shown = true)
  const hideMenu = () => (shown = false)
  const setMenuPosition = coordinates => (position = coordinates)
  const closeMenu = () => (menuTrackId = null)
  const isMenuClosed = ({ id }) => id !== menuTrackId

  // New track creation
  const nextTrackId = () => $tracks$.length + 1
  const nextTrackLabel = () => `Tracks ${nextTrackId()}`
  const nextTrack = rest => ({ id: nextTrackId(), label: nextTrackLabel(), ...rest })

  const newChannel = ({ muted: mute, ...rest }) => new Channel({ mute, ...rest })
  const setChannel = (channel, { muted: mute, volume }) => channel.set({ volume, mute })

  const addChannel = channel => (channels = [...channels, channel])
  const indexChannel = (channel, id) => channel.set({ name: id })
  const removeChannel = ({ name: a }) => (channels = channels.filter(({ name: b }) => a !== b))

  const addTrack = () => tracks$.next([...$tracks$, nextTrack({ volume: 0, muted: false })])
  const indexTrack = (track, id) => ({ ...track, id: id + 1, label: `Track ${id + 1}` })
  const removeTrack = () => tracks$.next($tracks$.filter(isMenuClosed).map(indexTrack))

  // Create from state
  const master = newChannel($master$).toDestination()
  let channels = $tracks$.map(track => newChannel(track).connect(master))
  const synth = new Synth($synth$).connect(channels[0])

  // Index all channels (master and track channels)
  indexChannel(master, -1)
  channels.forEach((channel, i) => indexChannel(channel, $tracks$[i].id))

  const trackIds = () => $tracks$.map(({ id }) => id)
  const channelIds = () => channels.map(({ name }) => name)
  const removedTrackId = () => diff(channelIds(), trackIds())
  const removedTrack = () => channels.filter(({ name }) => removedTrackId().includes(name))
  const disposeRemovedTrack = () => removedTrack().forEach(channel => channel.dispose())
  const removeRemovedTrack = () => removedTrack().forEach(channel => removeChannel(channel))

  const updateChannels = () => channels.forEach((channel, i) => setChannel(channel, $tracks$[i]))

  const shouldAddTrack = () => $tracks$.length > channels.length
  const shouldRemoveTrack = () => $tracks$.length < channels.length

  // Handle state updates
  $: {
    // Master channel
    master.set({ volume: $master$.volume, mute: $master$.muted })
    // Track channels
    if (shouldAddTrack()) addChannel(new Channel().set({ name: $tracks$.length }).connect(master))
    if (shouldRemoveTrack()) disposeRemovedTrack()
    if (shouldRemoveTrack()) removeRemovedTrack()
    updateChannels()
    // Playback (calling Tone.start() prevents suspended AudioContext)
    $playing$ ? Tone.start() && Transport.start() : Transport.stop()
    Transport.bpm.value = $bpm$
  }

  const handleContextMenu = ({ clientX: x, clientY: y }, id) => {
    setMenuTrackId(id)
    showMenu()
    setMenuPosition({ x, y })
  }

  const handleRemove = () => removeTrack() && closeMenu()

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

  /*
   * Handle DOM events
   */

  onDestroy(() => Transport.stop())
</script>

<div class="container">
  <Header>
    <TransportControls />
    <MIDIDevices />
  </Header>
  <ToggleTheme />
  <Scene />
  <div class="channel-strips">
    <div class="tracks">
      {#each $tracks$ as { id, label, volume, muted }}
        <ChannelStrip
          {label}
          bind:volume
          bind:muted
          selected={$selected$ === id}
          on:contextmenu={e => handleContextMenu(e, id)}
          on:click={selected$.set(id)}
          type="track"
        />
      {/each}
    </div>
    <AddTrack on:click={addTrack} />
    <ChannelStrip
      label="Master"
      bind:volume={$master$.volume}
      bind:muted={$master$.muted}
      on:click={() => selected$.set(-1)}
      selected={$selected$ === -1}
      type="master"
    />
  </div>
  <pre />
</div>

{#if menuTrackId}
  <div
    id="context"
    style="--display: {shown ? 'block' : 'none'}; --top: {position.y}px; --left: {position.x}px"
  >
    <ul>
      <li>
        <span>Track {menuTrackId}</span>
      </li>
      <li class="option" on:click={handleRemove}><TrashCan24 />Remove</li>
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
</style>
