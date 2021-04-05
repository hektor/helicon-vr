/**
 * Decibel range (-60-6) to normalized range (0-1)
 * 
 * @param {Number} dB 
 * @returns {Number}
 */

export const normalize = dB => (dB - -60) / (6 - -60)