import { interval } from 'rxjs'
import { debounce } from 'rxjs/operators'
import { writable$ } from './utils/observable-store'

export const playing$ = writable$(false)
export const bpm$ = writable$(localStorage.getItem('bpm') || 120)
export const vol$ = writable$(localStorage.getItem('vol') || -60) // decibels

/*
 * Persist playback settings (rate-limited)
 */

vol$.pipe(debounce(() => interval(500))).subscribe(vol => localStorage.setItem('vol', vol))
bpm$.pipe(debounce(() => interval(500))).subscribe(bpm => localStorage.setItem('bpm', bpm))
