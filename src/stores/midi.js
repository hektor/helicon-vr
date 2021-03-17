import { BehaviorSubject } from 'rxjs'

export const notes$ = new BehaviorSubject()
export const controls$ = new BehaviorSubject()

notes$.subscribe(note => console.log('Note', note))
controls$.subscribe(control => console.log('Control', control))
