<script>
  import Header from '../components/header.component.svelte'
</script>

<div class="container">
  <Header />
  <main>
    <h1>404</h1>
    <p>Page not found.</p>
    <a href="/#/">Take me home</a>
  </main>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--color-bg);
  }
</style>
