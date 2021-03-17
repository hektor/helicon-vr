<script>
  import Router from 'svelte-spa-router'

  // Pages
  import Home from './pages/home.page.svelte'
  import About from './pages/about.page.svelte'
  import MIDI from './pages/midi.page.svelte'

  const routes = { '/': Home, '/about': About, '/midi': MIDI }
</script>

<Router {routes} />

<style>
  :global(:root) {
    --tp-base-background-color: hsla(0, 0%, 7%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 5%, 1);
    --tp-button-background-color: hsla(0, 0%, 20%, 1);
    --tp-button-background-color-active: rgba(89, 89, 89, 1);
    --tp-button-background-color-focus: rgba(77, 77, 77, 1);
    --tp-button-background-color-hover: rgba(64, 64, 64, 1);
    --tp-button-foreground-color: hsla(0, 0%, 80%, 1);
    --tp-folder-background-color: hsla(0, 0%, 13%, 1);
    --tp-folder-background-color-active: hsla(0, 0%, 28%, 1);
    --tp-folder-background-color-focus: hsla(0, 0%, 23%, 1);
    --tp-folder-background-color-hover: hsla(0, 0%, 18%, 1);
    --tp-folder-foreground-color: hsla(0, 0%, 80%, 1);
    --tp-input-background-color: hsla(0, 0%, 11%, 1);
    --tp-input-background-color-active: hsla(0, 0%, 26%, 1);
    --tp-input-background-color-focus: hsla(0, 0%, 21%, 1);
    --tp-input-background-color-hover: hsla(0, 0%, 16%, 1);
    --tp-input-foreground-color: hsla(0, 0%, 80%, 1);
    --tp-input-guide-color: hsla(0, 0%, 20%, 1);
    --tp-monitor-background-color: hsla(0, 0%, 7%, 1);
    --tp-monitor-foreground-color: hsla(0, 0%, 80%, 1);
    --tp-label-foreground-color: hsla(0, 0%, 80%, 1);
    --tp-separator-color: hsla(0, 0%, 7%, 1);
  }
</style>
