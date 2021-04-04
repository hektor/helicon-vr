/**
 * Array difference (a - b)
 * 
 * @param {Array} a 
 * @param {Array} b 
 * @returns 
 */

export const diff = (a, b) => a.filter(x => !b.includes(x))