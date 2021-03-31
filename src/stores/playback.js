import { interval } from 'rxjs'
import { debounce } from 'rxjs/operators'
import { writable$ } from './utils/observable-store'

const defaults = {
  playing: false,
  bpm: 120,
  volume: 0,
  muted: false,
}

export const playing$ = writable$(defaults.playing)
export const bpm$ = writable$(JSON.parse(localStorage.getItem('bpm')) || defaults.bpm)
export const vol$ = writable$(JSON.parse(localStorage.getItem('vol')) || defaults.volume)
export const muted$ = writable$(JSON.parse(localStorage.getItem('muted')) || defaults.muted)

/*
 * Persist playback settings (rate-limited)
 */

bpm$.pipe(debounce(() => interval(500))).subscribe(bpm => localStorage.setItem('bpm', bpm))
vol$.pipe(debounce(() => interval(500))).subscribe(vol => localStorage.setItem('vol', vol))
muted$.subscribe(muted => localStorage.setItem('muted', muted))
