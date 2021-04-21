import { interval } from 'rxjs'
import { debounce } from 'rxjs/operators'
import { writable$ } from './utils/observable-store'

const defaults = {
  selected: -1,
  master: { label: 'Master', volume: 0, muted: false },
  tracks: [
    { id: 1, label: 'Track 1', volume: 0, muted: false },
    { id: 2, label: 'Track 2', volume: 0, muted: false },
    { id: 3, label: 'Track 3', volume: 0, muted: false },
    { id: 4, label: 'Track 4', volume: 0, muted: false }
  ]
}

export const master$ = writable$(JSON.parse(localStorage.getItem('master')) || defaults.master)
export const tracks$ = writable$(JSON.parse(localStorage.getItem('tracks')) || defaults.tracks)
export const selected$ = writable$(defaults.selected)

/*
 * Persist all channel states
 */

master$
  .pipe(debounce(() => interval(500)))
  .subscribe(master => localStorage.setItem('master', JSON.stringify(master)))

tracks$
  .pipe(debounce(() => interval(500)))
  .subscribe(tracks => localStorage.setItem('tracks', JSON.stringify(tracks)))
