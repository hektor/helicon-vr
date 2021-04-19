<script>
  import TrashCan24 from 'carbon-icons-svelte/lib/TrashCan24'
  import { onDestroy } from 'svelte'
  import * as Tone from 'tone'
  import { Transport, Channel, Synth } from 'tone'

  import { diff } from '../lib/array'

  import { playing$, bpm$ } from '../stores/playback'
  import { master$, tracks$, selected$ } from '../stores/mixer'
  import { synths$ } from '../stores/synths'

  import Collapsible from '../components/collapsible.component.svelte'
  import Scene from '../components/scene.component.svelte'
  import SynthModules from '../components/synth-modules.component.svelte'
  import Header from '../components/header.component.svelte'
  import TransportControls from '../components/transport-controls.svelte'
  import MIDIDevices from '../components/midi-devices.component.svelte'
  import ChannelStrip from '../components/channel-strip.component.svelte'
  import AddTrack from '../components/add-track.component.svelte'
  import Piano from '../components/piano.component.svelte'

  // Menu

  let position = { x: 0, y: 0 }
  let shown = false
  let menuTrackId = null

  const menu = {
    show: () => (shown = true),
    hide: () => (shown = false),
    close: () => (menuTrackId = null),
    setTrackId: id => (menuTrackId = id),
    setPosition: coordinates => (position = coordinates),
    isClosed: ({ id }) => id !== menuTrackId,
  }

  /*
   * Tone settings
   */

  const context = new Tone.Context({ latencyHint: 'interactive' })
  Tone.setContext(context)

  // New track creation
  const nextTrackId = () => $tracks$.length + 1
  const nextTrackLabel = () => `Tracks ${nextTrackId()}`
  const nextTrack = rest => ({ id: nextTrackId(), label: nextTrackLabel(), ...rest })

  const newChannel = ({ muted: mute, ...rest }) => new Channel({ mute, ...rest })
  const setChannel = (channel, { muted: mute, volume }) => channel.set({ volume, mute })

  const addChannel = channel => (channels = [...channels, channel])
  const indexChannel = (channel, id) => channel.set({ name: id })
  const removeChannel = ({ name: a }) => (channels = channels.filter(({ name: b }) => a !== b))

  const addTrack = track => tracks$.next([...$tracks$, track])
  const indexTrack = (track, id) => ({ ...track, id: id + 1, label: `Track ${id + 1}` })
  const removeTrack = () => tracks$.next($tracks$.filter(menu.isClosed).map(indexTrack))

  // Create from state
  const master = newChannel($master$).toDestination()
  let channels = $tracks$.map(track => newChannel(track).connect(master))

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

  /*
   * Handle state updates
   */

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

  /*
   * Add synths
   */

  const synths = $synths$.map(settings => new Synth(settings))
  synths.forEach((synth, i) => synth.connect(channels[i]))
  synths$.subscribe(settings => settings.forEach((setting, i) => synths[i].set(setting)))

  const cycles = [
    ['C4', null, 'D4', null],
    ['E4', 'F4', 'F4', 'G4', 'E4'],
    ['G4', 'A4', 'A4'],
    ['G4', 'A4', 'A4', 'C5'],
  ]

  let indeces = [0, 0, 0, 0]
  const loops = $tracks$.map((_, i) => time => {
    let step = indeces[i] % cycles[i].length
    console.log(cycles[i].length)
    let input = cycles[i][step]
    input && synths[i].triggerAttackRelease(cycles[i][step], '32n', time)
    indeces[i]++
  })

  loops.forEach(loop => Transport.scheduleRepeat(loop, '4n'))

  /*
   * Handle DOM events
   */

  const handleContextMenu = ({ clientX: x, clientY: y }, id) => {
    menu.setTrackId(id)
    menu.show()
    menu.setPosition({ x, y })
  }

  const handleRemove = () => removeTrack() && menu.close()
  const handleAddTrack = () => addTrack(nextTrack({ volume: 0, muted: false }))

  /*
   * Piano
   */

  let pianoSynth = null
  selected$.subscribe(selected =>
    selected !== -1 ? (pianoSynth = synths[selected - 1]) : (pianoSynth = null),
  )
  const midiMessageToNoteName = msg => Tone.Frequency(msg[1], 'midi')
  const handleNoteOn = ({ detail }) => pianoSynth.triggerAttack(midiMessageToNoteName(detail))
  const handleNoteOff = () => pianoSynth.triggerRelease()

  onDestroy(() => {
    playing$.next(false)
  })
</script>

<svelte:head>
  <title>World</title>
</svelte:head>
<div class="container">
  <Header>
    <TransportControls />
    <MIDIDevices />
  </Header>
  <Scene />
  <Collapsible title="Instruments">
    <div class="module-groups">
      {#each $synths$ as synth}
        <div class="module-group">
          <SynthModules bind:synth />
        </div>
      {/each}
    </div>
  </Collapsible>
  <Collapsible title="Mixer">
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
      <AddTrack on:click={handleAddTrack} />
      <ChannelStrip
        label="Master"
        bind:volume={$master$.volume}
        bind:muted={$master$.muted}
        on:click={() => selected$.set(-1)}
        selected={$selected$ === -1}
        type="master"
      />
    </div>
  </Collapsible>
  {#if pianoSynth}
    <Collapsible title={`Piano (track ${$selected$})`}>
      <Piano on:noteon={handleNoteOn} on:noteoff={handleNoteOff} />
    </Collapsible>
  {/if}
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
<svelte:body on:click={menu.hide} on:contextmenu|preventDefault />

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
  }

  .channel-strips {
    min-width: 9.6rem;
    max-width: 100vw;
    margin-top: auto;
    display: flex;
    padding: 1.6rem 1.6rem;
    padding-right: 4rem;
  }

  .module-groups {
    flex: 1;
    display: flex;
    overflow-x: auto;
  }

  .module-group {
    flex: 1;
    display: flex;
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
    margin-left: 0.8rem;
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
