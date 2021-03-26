import { interval } from 'rxjs'
import { debounce } from 'rxjs/operators'
import { writable$ } from './utils/observable-store'

export const playing$ = writable$(false)
export const bpm$ = writable$(JSON.parse(localStorage.getItem('bpm')) || 120)
export const vol$ = writable$(JSON.parse(localStorage.getItem('vol')) || -60) // decibels
export const mute$ = writable$(JSON.parse(localStorage.getItem('mute')) || false)

/*
 * Persist playback settings (rate-limited)
 */

bpm$.pipe(debounce(() => interval(500))).subscribe(bpm => localStorage.setItem('bpm', bpm))
vol$.pipe(debounce(() => interval(500))).subscribe(vol => localStorage.setItem('vol', vol))
mute$.subscribe(mute => localStorage.setItem('mute', mute))
