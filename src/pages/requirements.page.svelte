<div class="container">
  <h1>Requirements</h1>
  <hr />
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
      <hr />
      <div class="links">
        <a href="https://caniuse.com/?search=midi"> MIDI support</a>
        <a href="https://caniuse.com/?search=webxr"> WebXR support</a>
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
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 3.2rem;
  }

  .row {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }

  section {
    flex: 1;
    margin: 1.6rem 6.4rem 0 0;
    min-width: 32rem;
  }

  .links {
    display: flex;
    flex-direction: column;
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
