<script>
  import Router from 'svelte-spa-router'
  import { theme } from './stores/theme'
  import { setThemeAttribute } from './lib/theme'

  // Routes
  import Home from './routes/home.route.svelte'
  import World from './routes/world.route.svelte'
  import About from './routes/about.route.svelte'
  import FAQ from './routes/faq.route.svelte'
  import MIDI from './routes/midi.route.svelte'
  import Requirements from './routes/requirements.route.svelte'
  import NotFound from './routes/not-found.route.svelte'

  const routes = {
    '/': Home,
    '/world': World,
    '/about': About,
    '/faq': FAQ,
    '/requirements': Requirements,
    '/midi': MIDI,
    '*': NotFound,
  }

  theme.subscribe(setThemeAttribute)
</script>

<Router {routes} />

<style>
  /*
   * App specific global styling
   */

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

  :global(h1) {
    font-size: 2.4rem;
  }

  :global(h2) {
    font-size: 2rem;
  }

  :global(summary) {
    padding: 3.2rem 1.6rem;
    border-bottom: 1px solid var(--color-1);
  }

  :global(details[open] summary ~ *) {
    animation: sweep 0.5s ease-in-out;
  }

  @keyframes -global-sweep {
    0% {
      opacity: 0;
      margin-left: -10px;
    }
    100% {
      opacity: 1;
      margin-left: 0px;
    }
  }

  :global(kbd) {
    background-color: var(--color-1);
    border: 1px solid var(--color-5);
    color: var(--color-primary);
    line-height: 1;
    padding: 1.6rem;
    margin: 0.8rem;
  }
</style>
