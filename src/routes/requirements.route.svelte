<script>
  import Information24 from 'carbon-icons-svelte/lib/Information24'

  import Header from '../components/header.component.svelte'
  import NavBack from '../components/nav-back.component.svelte'
  import BrowserSupport from '../components/browser-support.component.svelte'
  import HardwareSupport from '../components/hardware-support.component.svelte'
</script>

<svelte:head>
  <title>Requirements</title>
</svelte:head>
<div class="container">
  <Header>
    <h1>Requirements</h1>
    <NavBack />
  </Header>
  <main>
    <div class="row">
      <section>
        <h2>Browser support</h2>
        <ul>
          <li>Chrome <small>(recommended)</small></li>
          <li>Chromium <small>(recommended)</small></li>
          <li>Brave <small>(recommended)</small></li>
        </ul>
        <ul>
          <li>Edge <small>(not recommended)</small></li>
          <li>Opera <small>(not recommended)</small></li>
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
        <BrowserSupport><h2 slot="header">Browser check</h2></BrowserSupport>
      </section>
      <section>
        <h2>Hardware requirements</h2>
        <ul>
          <li>8GB+ RAM <small>(recommended)</small></li>
          <li>Recent CPU <small>(recommened)</small></li>
          <li>Recent graphics card <small>(recommended)<small /></small></li>
        </ul>
      </section>
      <section>
        <HardwareSupport><h2 slot="header">Hardware check</h2></HardwareSupport>
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

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.6rem;
  }

  .row {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem;
  }

  section {
    border: 1px solid var(--color-1);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 32rem;
  }

  section h2 {
    background: var(--color-1);
    padding: 1.6rem;
  }

  .links {
    display: flex;
    flex-direction: column;
    padding: 1.6rem;
    background: var(--color-bg);
    margin-top: auto;
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
    padding: 0;
  }

  li {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 3.2rem 1.6rem;
    border-bottom: 1px solid var(--color-1);
  }

  span :global(svg) {
    margin-right: 0.8rem;
  }
</style>
