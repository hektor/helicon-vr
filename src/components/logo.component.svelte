<svg viewBox="0 0 100 100" width={32} height={32}>
  <path class="frame" d="M0 0, 100 0, 100 100, 0 100 Z" />
  {#each Array(3) as _, i}
    <path
      d={`M0,0 C${Math.random() * i * 100},${Math.random() * i * 100} ${
        Math.random() * i * 100
      },0 ${Math.random() * i * 100}, 100`}
    />
  {/each}
</svg>

<style>
  path {
    stroke: var(--color-primary);
    stroke-width: 4;
    fill: transparent;
  }

  .frame {
    stroke-width: 8;
  }
</style>
