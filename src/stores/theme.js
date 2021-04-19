import { writable, get } from 'svelte/store'
import { preference } from '../lib/theme'

/*
 * Check localStorage for previously selected theme preferences,
 * if none specified default to user's browser selected preference
 */

export const theme = writable(
  localStorage.getItem('theme') !== null ? localStorage.getItem('theme') : preference,
)

export const toggle = () => (get(theme) === 'light' ? theme.set('dark') : theme.set('light'))

/*
 * Persist theme preference
 */

theme.subscribe(name => localStorage.setItem('theme', name))
