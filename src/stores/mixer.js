import { interval } from 'rxjs'
import { debounce } from 'rxjs/operators'
import { writable$ } from './utils/observable-store'

export const master$ = writable$({ label: 'Master', volume: -60, mute: false })

export const tracks$ = writable$(
  JSON.parse(localStorage.getItem('tracks')) || [
    { id: 1, label: 'Track 1', volume: 0, mute: false },
    { id: 2, label: 'Track 2', volume: 0, mute: false },
    { id: 3, label: 'Track 3', volume: 0, mute: false },
    { id: 4, label: 'Track 4', volume: 0, mute: false },
  ],
)

export const selected$ = writable$(-1)

/*
 * Persist all channel states
 */

master$
  .pipe(debounce(() => interval(500)))
  .subscribe(master => localStorage.setItem('master', JSON.stringify(master)))

tracks$
  .pipe(debounce(() => interval(500)))
  .subscribe(tracks => localStorage.setItem('tracks', JSON.stringify(tracks)))
