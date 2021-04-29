import { distinctUntilChanged } from 'rxjs/operators'
import { sequencer$ } from '../stores/euclid-sequencer'
import { bjorklund } from '../lib/bjorklund'
import { writable$ } from './utils/observable-store'

const notes = ['C3', 'E3', 'G3', 'C4', 'G4']

// Hacky object comparison
// Comparing JSON probably not way to go,
// as we have to guarantee order
const objEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export const rhythms$ = writable$().pipe(distinctUntilChanged(objEqual))

sequencer$.subscribe(sequencer => {
  rhythms$.next(
    sequencer.map(({ cycles }) =>
      cycles.map(({ steps, pulses }, i) =>
        bjorklund(pulses, steps).map(position => (position === 1 ? notes[i] : null)),
      ),
    ),
  )
})
