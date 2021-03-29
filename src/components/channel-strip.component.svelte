<script>
  import VolumeSlider from '../components/channel-fader.component.svelte'

  export let label
  export let volume
  export let mute
  export let master
</script>

<div class="channel-strip" class:master on:contextmenu>
  <VolumeSlider {label} {mute} bind:value={volume} />
  <input type="checkbox" class="channel-mute" class:mute bind:checked={mute} />
  <button
    class="channel-mute"
    class:mute
    on:click={() => {
      mute = !mute
    }}>M</button
  >
</div>

<style>
  .channel-strip {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 9.6rem;
  }

  .channel-mute {
    margin: 0.8rem;
    padding: 0.8rem;
    color: var(--color-3);
    border: 1px solid var(--color-1);
    background: var(--color-bg);
  }

  input[type='checkbox'] {
    display: none;
  }

  .mute {
    color: var(--color-bg);
    border: 1px solid var(--color-bg);
    background: var(--color-primary);
  }
</style>
