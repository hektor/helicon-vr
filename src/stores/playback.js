import { BehaviorSubject } from 'rxjs'

export const playing$ = new BehaviorSubject(false)
export const bpm$ = new BehaviorSubject(localStorage.getItem('bpm') || 120)
export const vol$ = new BehaviorSubject(localStorage.getItem('vol') || 100)

/*
 * Persist playback settings
 */

vol$.subscribe(vol => localStorage.setItem('vol', vol))
bpm$.subscribe(bpm => localStorage.setItem('bpm', bpm))
