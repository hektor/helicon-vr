<script>
  import Pin16 from 'carbon-icons-svelte/lib/Pin16'
  import PinFilled16 from 'carbon-icons-svelte/lib/PinFilled16'
  let open = false
  export let title = ''
</script>

<div class="slider" class:open>
  <div class="header">
    <span>{title}</span>
    <div class="actions">
      <button on:click={() => (open = !open)}>
        {#if open}
          <PinFilled16 />
        {:else}
          <Pin16 />
        {/if}
      </button>
    </div>
  </div>
  <slot />
</div>

<style>
  .header {
    display: flex;
    border-top: 1px solid var(--color-2);
    border-bottom: 1px solid var(--color-1);
  }

  .actions {
    margin-left: auto;
  }

  .actions > button {
    padding: 1.6rem;
  }

  .header > span {
    padding: 1.6rem;
  }

  .slider {
    top: 0;
    bottom: 100%;
    height: auto;
    position: relative;
    max-height: 6.4rem;
    overflow-y: hidden;
    transition: 0.3s;
  }

  .slider:hover,
  .slider.open {
    max-height: 100%;
    overflow-y: hidden;
  }
</style>
