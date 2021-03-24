<script>
  import { onMount } from 'svelte'
  import { fromEvent } from 'rxjs'
  import { inputs$, outputs$, inputNames$, outputNames$ } from '../stores/devices'

  import Renew from 'carbon-icons-svelte/lib/Renew16'
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

<div>
  <MidiPort />
  <button on:click={init}><Renew />Refresh MIDI devices</button>
  <pre>{JSON.stringify($inputNames$, 0, 2)}</pre>
  <pre>{JSON.stringify($outputNames$, 0, 2)}</pre>
</div>
