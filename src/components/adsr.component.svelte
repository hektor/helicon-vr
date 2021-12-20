<script>
  import { isNumber } from '@hektormisplon/numbers'

  export let envelope

  const width = 256
  const height = 128

  const totalTime = () =>
    [envelope.attack, envelope.decay, envelope.release].filter(isNumber).reduce((a, b) => a + b, 0)

  const normalize = time => time / totalTime()

  $: attackWidth = (width - 16) * normalize(envelope.attack)
  $: decayWidth = (width - 16) * normalize(envelope.decay)
  $: releaseWidth = (width - 16) * normalize(envelope.release)
</script>

<div>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" {width} {height}>
    <g fill="none" stroke="var(--color-5)">
      <path d="M{4},{height - 4} {attackWidth + 4},{4}" />
      <path
        d="M{attackWidth + 4},{4} 
          C{attackWidth + 4},{height -
          4 -
          envelope.sustain * (height - 8)} 
         {attackWidth + 12 + decayWidth},{height -
          4 -
          envelope.sustain * (height - 8)}
         {attackWidth + 12 + decayWidth},{height -
          4 -
          envelope.sustain * (height - 8)}"
      />
      <path
        d="M{attackWidth + decayWidth + 12} {height -
          4 -
          envelope.sustain * (height - 8)} {attackWidth + decayWidth + releaseWidth + 12} {height -
          4}"
      />
    </g>
    <g fill="var(--color-5)">
      <rect width={8} height={8} y={height - 8} x={0} />
      <rect width={8} height={8} x={attackWidth} y={0} />
      <rect
        width={8}
        height={8}
        x={attackWidth + decayWidth + 8}
        y={height - envelope.sustain * (height - 8) - 8}
      />
      <rect width={8} height={8} x={attackWidth + decayWidth + releaseWidth + 8} y={height - 8} />
    </g>
  </svg>
</div>

<style>
  div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-1);
    margin: 3.2rem 1.6rem;
  }
</style>
