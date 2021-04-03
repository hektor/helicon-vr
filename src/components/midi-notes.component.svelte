<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  import { skip, filter } from 'rxjs/operators'
  import { notes$ } from '../stores/midi.js'

  const noteNum = note => note[1]
  const noteVel = note => note[2]

  const isNoteOn = note => noteVel(note) > 0
  const isNoteOff = note => !isNoteOn(note)

  const noteOns = notes$.pipe(skip(1), filter(isNoteOn))
  const noteOffs = notes$.pipe(skip(1), filter(isNoteOff))

  noteOns.subscribe(note => dispatch('noteon', note))
  noteOffs.subscribe(note => dispatch('noteoff', note))
</script>
