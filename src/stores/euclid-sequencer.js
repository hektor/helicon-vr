import { writable$ } from './utils/observable-store'
import { tracks$ } from './mixer'

const defaults = tracks$.getValue().map((_, i) => ({
  id: i + 1,
  cycles: [
    {
      steps: 16,
      pulses: 3,
      note: 57 + i * 12,
    },
    {
      steps: 16,
      pulses: 2,
      note: 59 + i * 12,
    },
    {
      steps: 16,
      pulses: 5,
      note: 62 + i * 12,
    },
  ],
}))

export const sequencer$ = writable$(JSON.parse(localStorage.getItem('sequencer')) || defaults)

sequencer$.subscribe(sequencer => localStorage.setItem('sequencer', JSON.stringify(sequencer)))
