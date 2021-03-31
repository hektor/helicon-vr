<script>
  export let text = ''
  export let duration = 3000
  const { length } = text
</script>

<span style="--char-width: {length}ch; --steps: {length}; --duration: {`${duration / 1000}s`}">
  {text}
</span>

<style>
  span {
    font-size: 2.4rem;
    width: var(--char-width);
    animation: typing var(--duration) steps(var(--steps)), blink 0.5s step-end infinite alternate;
    white-space: nowrap;
    overflow: hidden;
    font-family: monospace;
  }

  @keyframes typing {
    from {
      width: 0;
    }
  }

  @keyframes blink {
    50% {
      border-color: transparent;
    }
  }
</style>
