<script>
  export let type
  export let cx
  export let pressed = false
  export let keybinding
  const cy = type === 'ivory' ? 16 : 8
  const r = type === 'ivory' ? 3 : 3 / 1.62

  const handleKeydown = ({ key }) => key === keybinding && (pressed = true)
  const handleKeyup = ({ key }) => key === keybinding && (pressed = false)
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} on:keydown on:keyup />
<circle class:pressed class={type} {cx} {cy} {r} on:mousedown on:mouseup />
<text fill="var(--color-bg)" text-anchor="middle" dominant-baseline="central" x={cx} y={cy}>
  {keybinding}
</text>

<style>
  .ivory {
    fill: var(--color-3);
  }

  .ivory.pressed,
  .ivory:hover {
    fill: var(--color-4);
  }

  .ebony {
    fill: var(--color-5);
  }

  .ebony.pressed,
  .ebony:hover {
    fill: var(--color-2);
  }

  circle {
    stroke-width: 0.01;
    transition: 0.16s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  }

  circle:hover,
  .pressed {
    stroke-width: 0.5;
    stroke: var(--color-primary);
  }

  text {
    font-size: 10%;
    pointer-events: none;
  }
</style>
