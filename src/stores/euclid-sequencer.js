import { writable$ } from './utils/observable-store'
import { tracks$ } from './mixer'

const defaults = tracks$.getValue().map((_, i) => ({
  id: i + 1,
  cycles: [
    {
      steps: 16,
      pulses: 3
    },
    {
      steps: 16,
      pulses: 2
    },
    {
      steps: 16,
      pulses: 5
    }
  ]
}))

export const sequencer$ = writable$(defaults)
