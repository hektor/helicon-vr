<script>
  import Light24 from 'carbon-icons-svelte/lib/Light24'
  import LightFilled24 from 'carbon-icons-svelte/lib/LightFilled24'

  import { theme } from '../stores/theme'

  const toggle = () => {
    $theme === 'dark' ? theme.set('light') : theme.set('dark')
  }
</script>

<button class="theme-toggle" on:click={toggle}>
  {#if $theme}
    <Light24 />
  {:else}
    <LightFilled24 />
  {/if}
</button>

<style>
  .theme-toggle {
    display: flex;
    padding: 0.8rem 0.4rem;
  }

  .theme-toggle > :global(svg) {
    fill: var(--color-5);
  }
</style>
