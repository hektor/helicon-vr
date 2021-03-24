import { BehaviorSubject } from 'rxjs'

export const playing$ = new BehaviorSubject(false)
export const bpm$ = new BehaviorSubject(localStorage.getItem('bpm') || 120)
export const vol$ = new BehaviorSubject(localStorage.getItem('vol') || 100)

/*
 * Support "binding"
 */
bpm$.set = bpm$.next

/*
 * Persist playback settings
 */

vol$.subscribe(vol => localStorage.setItem('vol', vol))
bpm$.subscribe(bpm => localStorage.setItem('bpm', bpm))

playing$.subscribe(console.log)
bpm$.subscribe(console.log)
vol$.subscribe(console.log)
