<script>
  import { onMount } from 'svelte'
  import { fromEvent } from 'rxjs'
  import { inputs$, outputs$, inputNames$, outputNames$ } from '../stores/devices'

  let modal

  import Renew from 'carbon-icons-svelte/lib/Renew16'
  import Close32 from 'carbon-icons-svelte/lib/Close32'
  import MidiPort from './icons/midi-port-icon.component.svelte'

  const doesMIDI = !!navigator.requestMIDIAccess

  const allow = async midi => {
    const { inputs, outputs } = midi

    inputs$.next([...inputs.values()])
    outputs$.next([...outputs.values()])
    inputNames$.next([...inputs.values()].map(({ name }) => name))
    outputNames$.next([...outputs.values()].map(({ name }) => name))

    fromEvent(midi, 'statechange').subscribe(console.log)
  }

  const reject = e => console.error('No MIDI access', e)

  const init = async () =>
    doesMIDI && (await navigator.requestMIDIAccess({ sysex: true }).then(allow, reject))

  onMount(init)
</script>

{@debug $inputNames$, $outputNames$}
<button on:click={modal.showModal()}>
  <MidiPort />
  <small>MIDI</small>
</button>
<dialog bind:this={modal}>
  <div class="modal-header">
    <h2>MIDI Devices</h2>
    <button on:click={modal.close()}> Close <Close32 /></button>
  </div>
  <div class="modal-body">
    <details>
      <summary>
        <span>Input devices</span>
      </summary>
      <ul>
        {#each $inputNames$ as name}
          <li>{name}</li>
        {/each}
      </ul>
    </details>
    <details>
      <summary>
        <span>Output devices</span>
      </summary>
      <ul>
        {#each $outputNames$ as name}
          <li>{name}</li>
        {/each}
      </ul>
    </details>
  </div>
  <div class="action-group">
    <button on:click={init}><Renew />Scan devices</button>
  </div>
</dialog>

<style>
  button {
    display: flex;
    padding: 1.6rem;
  }

  dialog {
    min-width: 50vw;
    max-width: 90vw;
    padding: 0;
    border: 1px solid var(--color-2);
    color: var(--color-primary);
  }

  :global(dialog[open]) {
    animation: appear 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.75);
    animation: appear 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  summary {
    padding: 3.2rem 1.6rem;
    border-bottom: 1px solid var(--color-1);
  }

  button {
    display: flex;
    align-items: center;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
  }

  li {
    margin: 0;
    padding: 3.2rem 1.6rem;
    border-left: 1px solid var(--color-1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid var(--color-3);
    background: var(--color-1);
  }

  .modal-header h2 {
    padding: 1.6rem 3.2rem;
  }

  .modal-body {
    height: 33vh;
    overflow-y: auto;
    padding: 3.2rem;
    background: var(--color-bg);
  }

  .action-group {
    padding: 3.2rem;
    background: var(--color-bg);
  }

  .action-group button {
    width: 100%;
    border: 1px solid var(--color-2);
  }

  @keyframes appear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes disappear {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
</style>
