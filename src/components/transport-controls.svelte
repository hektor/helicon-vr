<script>
  import * as Tone from 'tone'

  import Play32 from 'carbon-icons-svelte/lib/Play32'
  import Pause32 from 'carbon-icons-svelte/lib/Pause32'
  import Stop32 from 'carbon-icons-svelte/lib/Stop32'
  import { playing$, bpm$ } from '../stores/playback'

  const play = async () => {
    await Tone.context.resume().then(() => playing$.next(!$playing$))
  }
</script>

<div class="transport-controls">
  <div class="field tooltip key">
    <label for="bpm">BPM</label>
    <input id="bpm" type="number" bind:value={$bpm$} step="0.1" min="1" max="10000" />
  </div>
  <button id="play" on:click={play} class="tooltip key" class:playing={$playing$}>
    {#if $playing$}
      <Pause32 />
      <small>Pauze</small>
    {:else}
      <Play32 />
      <small>Play</small>
    {/if}
  </button>
  <button id="stop" class="tooltip key" disabled={!$playing$} on:click={() => playing$.next(false)}>
    <Stop32 />
    <small>Stop</small>
  </button>
</div>

<style>
  button {
    display: flex;
    align-items: center;
    padding: 0.8rem 0.8rem;
    min-height: 6.4rem;
    min-width: 9.6rem;
  }

  .field {
    display: flex;
    align-items: center;
    min-height: 6.4rem;
    max-width: 12.8rem;
  }

  .field > input {
    background: transparent;
    min-height: 6.4rem;
    border: none;
    color: var(--color-primary);
  }

  .field > label {
    padding: 1.6rem;
  }

  .transport-controls {
    display: flex;
    border-bottom: 1px solid var(--color-1);
  }

  button:disabled.playing {
    color: var(--playing);
  }

  button:disabled {
    color: var(--color-5);
  }
</style>
