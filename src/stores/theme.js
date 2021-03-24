import { writable } from 'svelte/store'

/*
 * Check localStorage for previously selected theme preferences,
 * if none specified default to user's browser selected preference
 */

export const theme = writable(
  localStorage.getItem('theme') !== null
    ? localStorage.getItem('theme')
    : matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light',
)

/*
 * Persist theme preference
 */

theme.subscribe(mode => localStorage.setItem('theme', mode))
