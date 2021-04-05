<script>
  import ChannelFader from '../components/channel-fader.component.svelte'

  export let label
  export let volume
  export let muted
  export let type
  export let selected
</script>

<div class="channel-strip" class:type class:selected on:contextmenu>
  <ChannelFader {label} {muted} bind:value={volume} />
  <input type="checkbox" class="channel-muted" class:muted bind:checked={muted} />
  <button
    class="channel-muted"
    class:muted
    on:click={() => {
      muted = !muted
    }}>M</button
  >
  <button class="select" on:click><small>Select</small></button>
</div>

<style>
  .channel-strip {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 9.6rem;
  }

  .channel-muted {
    margin: 0.8rem;
    padding: 0.8rem;
    color: var(--color-3);
    border: 1px solid var(--color-1);
    background: var(--color-bg);
  }

  input[type='checkbox'] {
    display: none;
  }

  .muted {
    color: var(--color-bg);
    border: 1px solid var(--color-bg);
    background: var(--color-primary);
  }

  .select {
    background: var(--color-1);
    margin: 1.6rem 0;
  }

  .selected {
    background: var(--color-1);
  }
</style>
