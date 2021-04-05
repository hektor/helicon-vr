<script>
  import Moon24 from 'carbon-icons-svelte/lib/Moon24'
  import LightFilled24 from 'carbon-icons-svelte/lib/LightFilled24'

  import { theme } from '../stores/theme'

  const toggle = () => {
    $theme === 'dark' ? theme.set('light') : theme.set('dark')
  }
</script>

<button class="theme-toggle" on:click={toggle}>
  {#if $theme === 'light'}
    <Moon24 />
  {:else}
    <LightFilled24 />
  {/if}
</button>

<style>
  .theme-toggle {
    display: flex;
    padding: 1.6rem 0.8rem;
  }

  .theme-toggle > :global(svg) {
    fill: var(--color-5);
  }
</style>
