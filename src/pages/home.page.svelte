<script>
  import CheckmarkFilled32 from 'carbon-icons-svelte/lib/CheckmarkFilled32'
  import Misuse32 from 'carbon-icons-svelte/lib/Misuse32'

  const supportsMIDI = !!navigator.requestMIDIAccess
  const supportsVR = !!navigator.xr
</script>

<div class="container">
  <div class="col col-left">
    <h1>Helicon 1.0</h1>
    <span>An immersive introduction to polyrhythms</span>
  </div>
  <div class="col col-right">
    <div class="nav-group">
      <nav>
        <a href="/#/world">Discover</a>
        <a href="/#/test">Test</a>
      </nav>
      <nav>
        <a href="/#/about">About</a>
        <a href="/#/faq">FAQ</a>
      </nav>
    </div>
    <div class="supports-group">
      <div class="supports-group-header">
        <h2>Browser requirements</h2>
        <a href="/#/requirements">Learn more</a>
      </div>
      <div class="supports">
        {#if supportsMIDI}
          <CheckmarkFilled32 />
          <div>
            <span>MIDI</span>
            <small>Supported by your browser.</small>
          </div>
        {:else}
          <Misuse32 />
          <span>MIDI</span>
          <small>Not supported by your browser.</small>
        {/if}
      </div>
      <div class="supports">
        {#if supportsVR}
          <CheckmarkFilled32 />
          <div>
            <span>VR</span>
            <small>Supported by your browser.</small>
          </div>
        {:else}
          <Misuse32 />
          <div>
            <span>VR</span>
            <small>Not supported by your browser.</small>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
  }

  .col {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.6rem;
  }

  .col-left {
    color: #ccc;
    background: #555;
    max-width: 48rem;
  }

  .nav-group {
    flex: 1;
  }

  .supports-group {
    display: flex;
    flex-direction: column;
  }

  .supports-group-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 1.6rem;
  }

  .supports-group-header > h2 {
    margin-right: auto;
    font-size: 2rem;
  }

  .supports-group-header > a {
    font-size: 1.6rem;
  }

  .supports {
    display: flex;
    align-items: center;
    padding: 1.6rem;
    border-bottom: 1px solid #ccc;
  }

  .supports > div {
    margin-left: 1.6rem;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }

    .col-left {
      max-width: initial;
    }
  }
</style>
