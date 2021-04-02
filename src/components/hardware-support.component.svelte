<script>
  import CheckmarkFilled32 from 'carbon-icons-svelte/lib/CheckmarkFilled32'
  import Misuse32 from 'carbon-icons-svelte/lib/Misuse32'
  import Question32 from 'carbon-icons-svelte/lib/Help32'

  const memory = navigator.deviceMemory
  const cores = navigator.hardwareConcurrency
</script>

<div class="supports-group">
  <slot name="header">
    <div class="supports-group-header">
      <h2>Browser requirements</h2>
      <a href="/#/requirements">Learn more</a>
    </div>
  </slot>
  <div class="supports">
    {#if cores >= 4}
      <CheckmarkFilled32 />
      <div>
        CPU
        <small>(estimation)</small>
      </div>
    {:else if cores < 4}
      <Misuse32 />
      <div>
        CPU
        <small>(estimation)</small>
      </div>
    {:else}
      <Question32 />
      <div>No CPU information available</div>
    {/if}
  </div>
  <div class="supports">
    {#if memory >= 8}
      <CheckmarkFilled32 />
      <div>
        Sufficient memory
        <small>(estimation)</small>
      </div>
    {:else if cores < 4}
      <Misuse32 />
      <div>
        Insufficient memory
        <small>(estimation)</small>
      </div>
    {:else}
      <Question32 />
      <div>No memory information available</div>
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
