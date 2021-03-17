import { BehaviorSubject } from 'rxjs'

export let steps$ = new BehaviorSubject(10)
export let firstPulse$ = new BehaviorSubject(3)
export let secondPulse$ = new BehaviorSubject(2)
export let thirdPulse$ = new BehaviorSubject(5)
