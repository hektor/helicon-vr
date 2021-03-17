import { BehaviorSubject } from 'rxjs'

export const notes$ = new BehaviorSubject(null)
export const controls$ = new BehaviorSubject(null)

controls$.subscribe(control => console.log('Control', control))
