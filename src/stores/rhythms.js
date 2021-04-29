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
    sequencer.map(({ cycles }) => cycles.map(({ steps, pulses }) => bjorklund(pulses, steps))),
  )
})

export const notes$ = writable$()
const chord = ['C3', 'C4', 'G3']

rhythms$
  .pipe(
    map(rhythms => {
      console.log(rhythms)
      return rhythms.map(poly => poly.map((single, i) => mapBinary(single, [chord[i], null])))
    }),
  )
  .subscribe(notes => notes$.next(notes))
