import { flat as arrFlat } from '../lib/array'

/*
 * Bjorklund algorithm for generating Euclidean rhythms
 *
 * Space `k` pulses/onsets over `n` steps/positions
 * resulting in the Euclidean rhythm necklaces described by
 * Godfried Toussaint
 *
 * @param  {Number} k - Pulses
 * @param  {Number} n - Steps
 * @return {Array}    - Pattern
 */

export const bjorklund = (k, n) => {
  if (n <= 0) return [] // No steps
  if (k >= n) return Array(n).fill(1) // All pulses
  if (k <= 0) return Array(n).fill(0) // No  pulses

  let filled = Array(k).fill(1)
  let remaining = Array(n - k).fill(0)
  let minLength = Math.min(filled.length, remaining.length)

  while (minLength > 1) {
    for (let i = 0; i < minLength; i++) filled[i] = [].concat(filled[i], remaining[i])
    if (minLength === filled.length) {
      remaining = remaining.slice(minLength)
    } else {
      remaining = filled.slice(minLength)
      filled = filled.slice(0, minLength)
    }
    minLength = Math.min(filled.length, remaining.length)
  }
  return [...arrFlat(filled), ...arrFlat(remaining)]
}
