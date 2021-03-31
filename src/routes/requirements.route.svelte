<script>
  import Information24 from 'carbon-icons-svelte/lib/Information24'

  import Header from '../components/header.component.svelte'
  import NavBack from '../components/nav-back.component.svelte'
</script>

<div class="container">
  <Header>
    <NavBack />
  </Header>
  <main>
    <h1>Requirements</h1>
    <div class="row">
      <section>
        <h2>Browser support</h2>
        <ul>
          <li>Chrome (recommended)</li>
          <li>Chromium (recommended)</li>
          <li>Brave (recommended)</li>
        </ul>
        <ul>
          <li>Edge (not recommended)</li>
          <li>Opera (not recommended)</li>
        </ul>
        <div class="links">
          <span>
            <Information24 />
            More details:
          </span>
          <a target="_blank" href="https://caniuse.com/?search=midi"> MIDI support</a>
          <a target="_blank" href="https://caniuse.com/?search=webxr"> WebXR support</a>
        </div>
      </section>
      <section>
        <h2>Hardware requirements</h2>
        <ul>
          <li>8GB+ RAM</li>
          <li>Recent CPU</li>
          <li>Recent graphics card</li>
        </ul>
      </section>
    </div>
  </main>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  h1 {
    margin: 1.6rem 0;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 3.2rem;
    background: var(--color-1);
  }

  .row {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }

  section {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 1.6rem 6.4rem 0 0;
    min-width: 32rem;
  }

  .links {
    display: flex;
    flex-direction: column;
    padding: 1.6rem;
    background: var(--color-1);
    margin-top: auto;
  }

  .links span :global(svg) {
    margin: 0.8rem 0.8rem 0.8rem 0;
  }

  .links span {
    display: flex;
    align-items: center;
  }

  a {
    padding: 0.8rem 0;
  }

  ul {
    margin: 0;
    padding: 1.6rem 0;
  }

  li {
    list-style: none;
    padding: 1.6rem 0;
    border-bottom: 1px solid var(--color-1);
  }
</style>
