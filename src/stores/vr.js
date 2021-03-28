import { writable } from 'svelte/store'

/*
 * Full: 1,
 * Half: 0.5,
 * Quarter: 0.25,
 */

export const resolution = writable(JSON.parse(localStorage.getItem('resolution')) || 0.5)

/*
 * Persist vr settings
 */

resolution.subscribe(r => localStorage.setItem('resolution', r))
