import { interval } from 'rxjs'
import { debounce } from 'rxjs/operators'
import { writable$ } from './utils/observable-store'

const defaults = {
  playing: false,
  bpm: 120,
}

export const playing$ = writable$(defaults.playing)
export const bpm$ = writable$(JSON.parse(localStorage.getItem('bpm')) || defaults.bpm)

/*
 * Persist playback settings (rate-limited)
 */

bpm$.pipe(debounce(() => interval(500))).subscribe(bpm => localStorage.setItem('bpm', bpm))
