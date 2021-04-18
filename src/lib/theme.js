export const setThemeAttribute = theme => document.documentElement.setAttribute('data-theme', theme)
export const preference = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
