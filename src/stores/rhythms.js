import { distinctUntilChanged, map } from 'rxjs/operators'
import { sequencer$ } from '../stores/euclid-sequencer'
import { bjorklund } from '../lib/bjorklund'
import { mapBinary } from '../lib/array'
import { writable$ } from './utils/observable-store'

// Hacky object comparison
// Comparing JSON probably not way to go,
// as we have to guarantee order
const objEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export const rhythms$ = writable$().pipe(distinctUntilChanged(objEqual))

sequencer$.subscribe(sequencer => {
  rhythms$.next(
    sequencer.map(({ cycles }) =>
      cycles.map(({ steps, pulses, note }) => {
        return bjorklund(pulses, steps).map(position => (position === 1 ? note : 0))
      }),
    ),
  )
})

export const notes$ = writable$()

rhythms$.subscribe(notes => notes$.next(notes))
