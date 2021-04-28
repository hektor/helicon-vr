import { sequencer$ } from '../stores/euclid-sequencer'
import { bjorklund } from '../lib/bjorklund'
import { writable$ } from './utils/observable-store'

const notes = ['C3', 'E3', 'G3', 'C4']

export const rhythms$ = writable$()

sequencer$.subscribe(sequencer => {
  rhythms$.next(
    sequencer.map(({ cycles }) =>
      cycles.map(({ steps, pulses }, i) =>
        bjorklund(pulses, steps).map(position => (position === 1 ? notes[i] : null)),
      ),
    ),
  )
})
