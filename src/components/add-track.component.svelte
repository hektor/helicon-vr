<script>
  import AddFilled24 from 'carbon-icons-svelte/lib/AddFilled24'
</script>

<button class="channel-strip-add" on:click>
  <AddFilled24 style="fill: var(--color-2)" />
  <small> New track </small>
</button>

<style>
  .channel-strip-add {
    min-width: 9.6rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.6rem;
    border-left: 1px solid var(--color-1);
  }

  .channel-strip-add > small {
    padding: 0.8rem 0;
    color: var(--color-2);
  }
</style>
