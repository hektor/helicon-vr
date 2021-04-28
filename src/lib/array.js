/**
 * Array difference (a - b)
 *
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 */

export const diff = (a, b) => a.filter(x => !b.includes(x))

/**
 * Get first element of array
 *
 * @param {Array} arr
 * @returns {any}
 */

export const first = arr => arr[0]

