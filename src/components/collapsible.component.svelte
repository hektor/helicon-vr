<script>
  import Pin16 from 'carbon-icons-svelte/lib/Pin16'
  import PinFilled16 from 'carbon-icons-svelte/lib/PinFilled16'

  export let open = false
  export let title = ''

  let pinned = false

  const handlePin = () => (!pinned ? (open = true) && (pinned = true) : (pinned = false))
</script>

<div class="slider" class:open class:pinned>
  <div class="header" on:click={() => (open = !pinned ? !open : open)}>
    <span>{title}</span>
    <div class="actions">
      <button on:click={handlePin}>
        {#if pinned}
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
    transition: 0.1s cubic-bezier(0.2, 0.2, 0.38, 0.9);
  }

  .slider.open {
    max-height: 100%;
    overflow-y: hidden;
    transition: 0.3s cubic-bezier(0.2, 0.2, 0.38, 0.9);
  }
</style>
