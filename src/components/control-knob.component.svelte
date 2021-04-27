<script>
  export let id = ''
  export let value = 50
  export let min = 0
  export let max = 100
  export let step = 1

  const r = 50
  const c = 2 * Math.PI * r

  const strokeWidth = 8

  $: arcSize = (value / max) * c
  $: if (value > max) value = max
  $: if (value < min) value = min

  const handleChange = ({ target }) => (value = target.valueAsNumber || 0)
</script>

<div>
  <svg viewBox={`0 0 ${2 * r + strokeWidth} ${2 * r + strokeWidth}`}>
    <circle class="available" cx={r} cy={r} r={r - strokeWidth} stroke-width="1.25" />
    <circle
      class="filled"
      cx={r}
      cy={r}
      r={r - strokeWidth}
      transform="rotate(90)"
      transform-origin={`${r} ${r}`}
      stroke-dasharray={`${arcSize},${c}`}
      stroke-width={strokeWidth}
    />
    <foreignObject width="100" height="100">
      <input
        {id}
        {min}
        {max}
        {step}
        type="number"
        pattern="\d+(\.\d{2})?"
        on:change={handleChange}
        {value}
      />
    </foreignObject>
  </svg>
</div>

<style>
  div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    margin-left: 0.4rem;
    padding: 0.8rem;
    height: 9.6rem;
    width: 9.6rem;
  }

  circle {
    fill: none;
    stroke: var(--color-primary);
  }

  input {
    width: 100%;
    height: 100%;
    background: transparent;
    color: var(--color-primary);
    text-align: center;
    font-size: 2.4rem;
    border: none;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
