<script>
  import CheckmarkFilled32 from 'carbon-icons-svelte/lib/CheckmarkFilled32'
  import Misuse32 from 'carbon-icons-svelte/lib/Misuse32'

  import { resolution } from '../stores/vr'

  const supportsMIDI = !!navigator.requestMIDIAccess
  const supportsVR = !!navigator.xr
</script>

<div class="supports-group">
  <slot name="header">
    <div class="supports-group-header">
      <h2>Browser requirements</h2>
      <a href="/#/requirements">Learn more</a>
    </div>
  </slot>
  <div class="supports">
    <span>Resolution</span>
    <select bind:value={$resolution} name="resolution">
      <option selected={$resolution === 1} value={1}>Full</option>
      <option selected={$resolution === 0.5} value={0.5}>Half</option>
      <option selected={$resolution === 0.25} value={0.25}>Quarter</option>
    </select>
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

<style>
  select {
    flex: 1;
    margin: 0.8rem;
    margin-left: 3.2rem;
    margin-right: 0;
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
</style>
