import { interval } from 'rxjs'
import { debounce } from 'rxjs/operators'
import { writable$ } from './utils/observable-store'

const defaults = {
  synth: {
    envelope: {
      attack: 0.01,
      attackCurve: 'linear', // linear/exponential
      decay: 0.1,
      decayCurve: 'exponential',
      release: 1,
      releaseCurve: 'exponential',
      sustain: 0.5,
    },
    oscillator: {
      type: 'sine',
      volume: 0,
    },
    portamento: 0,
  },
}

export const synth$ = writable$(
  //  JSON.parse(localStorage.getItem('synth')) ||
  defaults.synth,
)

synth$
  .pipe(debounce(() => interval(100)))
  .subscribe(master => localStorage.setItem('synth', JSON.stringify(master)))
