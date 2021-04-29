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

/**
 * Get last element of array
 *
 * @param {Array} arr
 * @returns {any}
 */

export const last = arr => arr[1]

/**
 * Flatten array
 *
 * @param {Array} arr
 * @returns {Array} flattened array
 */

export const flat = arr => arr.flat()

/*
 * Binary array mapping
 *
 * @example [0,1,1] -> ['off', 'on', 'on']
 *
 * @param {Array} arr     Binary array
 * @param {Array} mapping Mapping values for 0,1
 *
 * @returns {Array}       Array mapped to mapping
 */

export const mapBinary = (arr, mapping = [false, true]) =>
  arr.map(el => (el ? first(mapping) : last(mapping)))
