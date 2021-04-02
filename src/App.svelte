<script>
  import Router from 'svelte-spa-router'
  import { theme } from './stores/theme'

  // Routes
  import Home from './routes/home.route.svelte'
  import World from './routes/world.route.svelte'
  import About from './routes/about.route.svelte'
  import FAQ from './routes/faq.route.svelte'
  import MIDI from './routes/midi.route.svelte'
  import Requirements from './routes/requirements.route.svelte'
  import Test from './routes/test.route.svelte'

  const routes = {
    '/': Home,
    '/world': World,
    '/about': About,
    '/faq': FAQ,
    '/requirements': Requirements,
    '/midi': MIDI,
    '/test': Test,
  }

  theme.subscribe(mode => document.documentElement.setAttribute('data-theme', mode))
</script>

<Router {routes} />

<style>
  /* Minimal outlines */
  :global(a:focus, button:focus, input:focus, select:focus, summary:focus) {
    outline: 0.1rem dashed var(--color-5);
  }

  /* Minimal scrollbars */
  :global(::-webkit-scrollbar) {
    width: 5px;
    height: 0.8rem;
    background-color: transparent;
    border-bottom: 1px solid var(--color-1);
  }

  :global(::-webkit-scrollbar-thumb) {
    background: var(--color-3);
  }

  /* Space icons from text in buttons and links */
  :global(button > svg:first-child, a > svg:first-child) {
    margin-right: 0.8rem;
  }

  :global(button > svg:last-child, a > svg:last-child) {
    margin-left: 0.8rem;
  }

  :global(select) {
    padding: 1.6rem;
    appearance: none;
    background: var(--color-bg);
    color: var(--color-primary);
    border-color: var(--color-2);
  }
</style>
