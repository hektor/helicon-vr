import { writable$ } from './utils/observable-store'

export const playing$ = writable$(false)
export const bpm$ = writable$(localStorage.getItem('bpm') || 120)
export const vol$ = writable$(localStorage.getItem('vol') || 100)

/*
 * Persist playback settings
 */

vol$.subscribe(vol => localStorage.setItem('vol', vol))
bpm$.subscribe(bpm => localStorage.setItem('bpm', bpm))

playing$.subscribe(console.log)
bpm$.subscribe(console.log)
vol$.subscribe(console.log)
