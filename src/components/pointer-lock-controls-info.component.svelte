<div class="enter">
  <div class="control-info">
    <div class="control">
      <span> Move up</span>
      <span><kbd>W</kbd>,<kbd>&#129121;</kbd></span>
    </div>
    <div class="control">
      <span> Move left</span>
      <span>
        <kbd>A</kbd>,<kbd>&#129128;</kbd>
      </span>
    </div>
    <div class="control">
      <span> Move down</span>
      <span>
        <kbd>S</kbd>,<kbd>&#129123;</kbd>
      </span>
    </div>
    <div class="control">
      <span> Move right</span>
      <span>
        <kbd>S</kbd>, <kbd>&#129122;</kbd>
      </span>
    </div>
    <slot />
  </div>
</div>

<style>
  .enter {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .control-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--color-bg);
    border: 1px solid var(--color-1);
  }

  .control {
    display: flex;
    padding: 1.6rem;
    border-width: 1px;
    border-color: var(--color-1);
    border-style: solid;
  }

  .control > * {
    flex: 1;
    display: flex;
    align-items: center;
  }
</style>
