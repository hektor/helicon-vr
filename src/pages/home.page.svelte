<script>
  import CheckmarkFilled32 from 'carbon-icons-svelte/lib/CheckmarkFilled32'
  import LogoGithub32 from 'carbon-icons-svelte/lib/LogoGithub32'
  import Misuse32 from 'carbon-icons-svelte/lib/Misuse32'

  import Typewriter from '../components/typewriter.component.svelte'

  import { resolution } from '../stores/vr'

  const supportsMIDI = !!navigator.requestMIDIAccess
  const supportsVR = !!navigator.xr
</script>

<div class="container">
  <div class="col col-left">
    <div class="title">
      <h1>Helicon 1.0</h1>
      <Typewriter text="An immersive introduction to polyrhythms." />
    </div>
    <div class="credits">
      <a class="repo" href="https://www.github.com/hektormisplon/bap"><LogoGithub32 /></a>
      <span
        >By &ensp;
        <a href="https://www.github.com/hektormisplon" target="_blank">Hektor Misplon</a>
      </span>
    </div>
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
    color: var(--color-primary);
    background: var(--color-1);
    max-width: 48rem;
  }

  .credits {
    border-top: 1px solid var(--color-3);
    padding: 1.6rem 1.6rem 0.8rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .credits > span {
    display: flex;
    align-items: center;
  }

  .repo {
    padding: 0.4rem 0.8rem;
  }

  .repo::after {
    content: '';
  }

  .title {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .title > h1 {
    margin: 1.6rem 0;
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
    border-bottom: 1px solid var(--color-1);
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
    border-bottom: 1px solid var(--color-1);
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
