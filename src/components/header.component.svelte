<script>
  import Logo from '../components/logo.component.svelte'
  let scrollY
  $: scrolled = scrollY > 0
</script>

<header style="--scrolled: {scrolled ? 'var(--color-1)' : 'var(--color-bg)'}">
  <a href="/#/">
    <Logo />
  </a>
  <slot />
</header>
<svelte:window bind:scrollY />

<style>
  a {
    display: flex;
    text-decoration: none;
    padding: 1rem;
  }

  header {
    position: sticky;
    top: 0;
    flex: 1;
    display: flex;
    align-items: center;
    max-height: 6.4rem;
    border-bottom: 1px solid var(--color-1);
    background: var(--scrolled);
  }
</style>
