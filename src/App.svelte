<script>
  import Router from 'svelte-spa-router'
  import { theme } from './stores/theme'

  // Routes
  import Home from './routes/home.route.svelte'
  import World from './routes/world.route.svelte'
  import About from './routes/about.route.svelte'
  import MIDI from './routes/midi.route.svelte'
  import Requirements from './routes/requirements.route.svelte'

  const routes = {
    '/': Home,
    '/world': World,
    '/about': About,
    '/requirements': Requirements,
    '/midi': MIDI,
  }

  theme.subscribe(mode => document.documentElement.setAttribute('data-theme', mode))
</script>

<Router {routes} />
