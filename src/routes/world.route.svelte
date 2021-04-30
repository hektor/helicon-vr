<script>
  import { onMount } from 'svelte'
  import TrashCan24 from 'carbon-icons-svelte/lib/TrashCan24'
  import { onDestroy } from 'svelte'
  import * as Tone from 'tone'
  import { Transport, Channel, PolySynth, Synth } from 'tone'

  import { first as arrFirst, diff as arrDiff } from '../lib/array'

  import { playing$, bpm$ } from '../stores/playback'
  import { notes$ } from '../stores/rhythms'

  import {
    master$,
    tracks$,
    selected$,
    latestRemoved$ as latestRemovedTrack$,
    latestAdded$ as latestAddedTrack$,
  } from '../stores/mixer'
  import { defaultSettings as defaultSynthSettings, synths$ } from '../stores/synths'
  import { sequencer$ } from '../stores/euclid-sequencer'

  import Collapsible from '../components/collapsible.component.svelte'
  import Scene from '../components/scene.component.svelte'
  import SynthModules from '../components/synth-modules.component.svelte'
  import SequencerSettings from '../components/sequencer-settings.component.svelte'
  import Header from '../components/header.component.svelte'
  import TransportControls from '../components/transport-controls.svelte'
  import MIDIDevices from '../components/midi-devices.component.svelte'
  import ChannelStrip from '../components/channel-strip.component.svelte'
  import AddTrack from '../components/add-track.component.svelte'
  import Piano from '../components/piano.component.svelte'
  import Tour from '../components/tour.component.svelte'

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

  Tone.setContext(new Tone.Context({ latencyHint: 'interactive' }))

  const { envelope, oscillator, portamento } = defaultSynthSettings

  $: next = {
    track: {
      id: $tracks$.length + 1,
      label: `Tracks ${$tracks$.length + 1}`,
      volume: 0,
      muted: false,
    },
    synth: {
      id: $synths$.length + 1,
      envelope,
      oscillator,
      portamento,
    },
  }

  const indexTrack = (track, id) => ({ ...track, id: id + 1, label: `Track ${id + 1}` })
  const indexSynth = (synth, id) => ({ ...synth, id: id + 1 })

  const nextTrack = track => {
    latestAddedTrack$.next(track)
    tracks$.next([...$tracks$, track])
  }

  const nextSynth = synth => synths$.next([...$synths$, synth])

  const nextRemoveTrack = () => {
    const removed = $tracks$.filter(track => !menu.isClosed(track))
    const remaining = arrDiff($tracks$, removed)
    selected$.next(-1)
    latestRemovedTrack$.next(arrFirst(removed))
    tracks$.next(remaining.map(indexTrack))
  }

  latestRemovedTrack$.subscribe(() => synths$.next($synths$.filter(menu.isClosed).map(indexSynth)))

  const addChannel = channel => (channels = [...channels, channel])
  const addSynth = synth => (synths = [...synths, synth])

  const removeChannel = ({ name: a }) => (channels = channels.filter(({ name: b }) => a !== b))
  const removeSynth = ({ name: a }) => (synths = synths.filter(({ name: b }) => a !== b))

  const newChannel = ({ muted: mute, ...rest }) => new Channel({ mute, ...rest })
  const setChannel = (channel, { muted: mute, volume }) => channel.set({ volume, mute })
  const indexChannel = (channel, id) => channel.set({ name: id })

  const newSynth = ({ id, ...rest }) => new PolySynth({ ...rest }).set({ name: id })

  // Create from state
  const master = newChannel($master$).toDestination()
  let channels = $tracks$.map(track => newChannel(track).connect(master))
  let synths = $synths$.map((settings, i) => newSynth(settings).connect(channels[i]))

  // Index all channels (master and track channels)
  indexChannel(master, -1)
  channels.forEach((channel, i) => indexChannel(channel, $tracks$[i].id))

  const trackIds = () => $tracks$.map(({ id }) => id)
  const channelIds = () => channels.map(({ name }) => name)
  const synthIds = () => synths.map(({ name }) => name)
  const removedChannelId = () => arrDiff(channelIds(), trackIds())
  const removedSynthId = () => arrDiff(synthIds(), trackIds())
  const removedChannel = () => channels.filter(({ name }) => removedChannelId().includes(name))
  const removedSynth = () => synths.filter(({ name }) => removedSynthId().includes(name))
  const disposeRemovedTrackChannel = () => removedChannel().forEach(channel => channel.dispose())
  const removeRemovedTrackChannel = () =>
    removedChannel().forEach(channel => removeChannel(channel))
  const disposeRemovedTrackSynth = () => removedSynth().forEach(synth => synth.dispose())
  const removeRemovedTrackSynth = () => removedSynth().forEach(synth => removeSynth(synth))

  const updateChannels = () => channels.forEach((channel, i) => setChannel(channel, $tracks$[i]))
  const updateSynths = () => synths.forEach((synth, i) => synth.set($synths$[i]))

  /*
   * Handle state updates
   */

  // Detect state changes
  const shouldAddTrack = () => $tracks$.length > channels.length
  const shouldRemoveTrack = () => $tracks$.length < channels.length
  const shouldAddSynth = () => $synths$.length > synths.length
  const shouldRemoveSynth = () => $synths$.length < synths.length
  // Handle state changes
  $: {
    // Master channel
    master.set({ volume: $master$.volume, mute: $master$.muted })
    // Track channels
    if (shouldAddTrack()) addChannel(new Channel().set({ name: $tracks$.length }).connect(master))
    if (shouldRemoveTrack()) {
      disposeRemovedTrackChannel()
      removeRemovedTrackChannel()
    }

    const newSynth = new PolySynth(defaultSynthSettings).set({ name: $synths$.length })
    if ($tracks$.length > 0) newSynth.connect(channels[$tracks$.length - 1])
    if (shouldAddSynth()) addSynth(newSynth)
    if (shouldRemoveSynth()) {
      disposeRemovedTrackSynth()
      removeRemovedTrackSynth()
    }

    updateChannels()
    updateSynths()

    $playing$ ? Transport.start() : Transport.stop()
    Transport.bpm.value = $bpm$
  }

  /*
   *
   */

  let flows

  const cycles = $notes$[0]
  let indeces = new Array(cycles.length).fill(0)

  const loops = cycles.map((_, i) => time => {
    let step = indeces[i] % cycles[i].length
    let input = cycles.map(cycle => cycle[step])
    /* console.log(input) */
    /* console.log(`${indeces[i] % cycles[i].length} of ${cycles[i].length}`) */
    input && synths[0].triggerAttackRelease(cycles[i][step], '8n', time)
    flows.moveIndividualAlongCurve(i, 1 / cycles[i].length)
    indeces[i]++
  })

  onMount(() => {
    for (let i = 0; i < flows.curveArray.length; i++) flows.moveIndividualAlongCurve(i, -0.38)
  })

  loops.forEach(loop => Transport.scheduleRepeat(loop, '8n'))

  /*
   * Handle DOM events
   */

  const handleContextMenu = ({ clientX: x, clientY: y }, id) => {
    menu.setTrackId(id)
    menu.show()
    menu.setPosition({ x, y })
  }

  const handleRemove = () => {
    if ($tracks$.length <= 1) return
    nextRemoveTrack()
    menu.close()
  }
  const handleAddTrack = () => {
    nextTrack(next.track)
    nextSynth(next.synth)
    selected$.next($tracks$.length)
  }

  /*
   * Piano
   */

  let pianoSynth = null

  selected$.subscribe(selected => {
    if (selected !== -1) {
      pianoSynth = synths[selected - 1]
    } else {
      pianoSynth = null
    }
  })

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
    <div class="actions">
      <MIDIDevices />
    </div>
  </Header>
  <Scene bind:flows />
  {#if $selected$ > 0}
    <Collapsible title={`Instrument (track ${$selected$})`}>
      <div class="module-groups">
        <div class="module-group">
          <SynthModules bind:synth={$synths$[$selected$ - 1]} />
        </div>
      </div>
    </Collapsible>
  {:else}
    <Collapsible title="Instruments (all tracks)">
      <div class="module-groups">
        {#each $synths$ as synth}
          <div class="module-group">
            <SynthModules bind:synth />
          </div>
        {/each}
      </div>
    </Collapsible>
  {/if}
  {#if $selected$ > 0}
    <Collapsible title={`Euclidean sequencer (track ${$selected$})`}>
      <div class="module-groups">
        <div class="module-group">
          <SequencerSettings bind:cycles={$sequencer$[$selected$ - 1].cycles} />
        </div>
      </div>
    </Collapsible>
  {:else}
    <Collapsible title="Euclidean sequencer (all tracks)">
      <div class="module-groups">
        {#each $sequencer$ as { cycles }}
          <div class="module-group">
            <SequencerSettings bind:cycles />
          </div>
        {/each}
      </div>
    </Collapsible>
  {/if}
  {#if pianoSynth}
    <Collapsible title={`Piano (track ${$selected$})`}>
      <Piano on:noteon={handleNoteOn} on:noteoff={handleNoteOff} />
    </Collapsible>
  {/if}
  <Collapsible title={`Mixer${$selected$ !== -1 ? ' (track ' + $selected$ + ')' : ''}`}>
    <div class="channel-strips">
      <div class="tracks">
        {#each $tracks$ as { id, label, volume, muted }}
          <ChannelStrip
            {label}
            bind:volume
            bind:muted
            selected={$selected$ === id}
            on:contextmenu={e => handleContextMenu(e, id)}
            on:click={() => selected$.set(id)}
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
</div>

{#if menuTrackId && $tracks$.length > 1}
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
<Tour />

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100vh;
  }

  .actions {
    margin-left: auto;
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
