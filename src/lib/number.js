/*
 * Number functions
 */

// Always double by addition
export const double = v => v + v
// Clamp value between lower and upper bound
export const clamp = (n, lo, hi) => (n <= lo ? lo : n >= hi ? hi : n)
// Check if value is number
export const isNumber = x => typeof x === 'number' && x
// Check if value is contained in closed interval
export const inClosed = (n, [lo, hi]) => n >= lo && n <= hi
// Check if value is contained in open interval
export const inOpen = (n, [lo, hi]) => n > lo && n < hi
// Clamp value to 7-bit value range (0-127)
export const sevenBitClamp = n => clamp(n, 0, 127)
