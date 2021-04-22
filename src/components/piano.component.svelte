<script>
  import { Subject, interval } from 'rxjs'
  import { debounce } from 'rxjs/operators'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  import Key from './piano-key.component.svelte'

  let octave = 4
  const allKeys = [...Array(11).keys()]
    .map(octave =>
      [
        { type: 'ivory', x: 8, keybinding: 'a' },
        { type: 'ebony', x: 12, keybinding: 'w' },
        { type: 'ivory', x: 16, keybinding: 's' },
        { type: 'ebony', x: 20, keybinding: 'e' },
        { type: 'ivory', x: 24, keybinding: 'd' },
        { type: 'ivory', x: 32, keybinding: 'f' },
        { type: 'ebony', x: 36, keybinding: 'u' },
        { type: 'ivory', x: 40, keybinding: 'j' },
        { type: 'ebony', x: 44, keybinding: 'i' },
        { type: 'ivory', x: 48, keybinding: 'k' },
        { type: 'ebony', x: 52, keybinding: 'o' },
        { type: 'ivory', x: 56, keybinding: 'l' },
      ].map((key, id) => ({
        ...key,
        id: id + octave * 12,
      })),
    )
    .flat()
    .filter(({ id }) => id < 128)

  $: start = octave * 12
  $: end = start + 12
  $: keys = allKeys.slice(start, end)

  const handleKeydown = ({ key, repeat }) => {
    if (!repeat)
      dispatch(
        'noteon',
        new Uint8Array([
          0x80,
          keys.filter(({ keybinding }) => keybinding === key).map(({ id }) => id)[0],
          127,
        ]),
      )
  }

  const handleKeyup = ({ key }) => {
    dispatch(
      'noteoff',
      new Uint8Array([
        0x90,
        keys.filter(({ keybinding }) => keybinding === key).map(({ id }) => id)[0],
        0,
      ]),
    )
  }

  const keyUp$ = new Subject()
  const keyDown$ = new Subject()

  // Prevent simultaneous note triggers to keep Tone.js happy
  keyUp$.pipe(debounce(() => interval(20))).subscribe(handleKeyup)
  keyDown$.pipe(debounce(() => interval(20))).subscribe(handleKeydown)

  const handleNoteOn = note => dispatch('noteon', new Uint8Array([0x80, note, 127]))
  const handleNoteOff = note => dispatch('noteoff', new Uint8Array([0x90, note, 0]))
</script>

<div class="panel">
  <div class="octave-action-group">
    <span>Octave</span>
    <div class="actions">
      <button on:click={() => octave < 10 && (octave += 1)}>+</button>
      <input type="number" bind:value={octave} min={0} max={10} />
      <button on:click={() => octave > 0 && (octave -= 1)}>-</button>
    </div>
  </div>
  <div class="piano">
    <svg viewBox="0 0 64 24">
      {#each keys as { type, x: cx, keybinding, id }}
        <Key
          {type}
          {cx}
          {keybinding}
          {id}
          on:keyup={e => keyUp$.next(e)}
          on:keydown={e => keyDown$.next(e)}
          on:mousedown={handleNoteOn(id)}
          on:mouseup={handleNoteOff(id)}
        />
      {/each}
    </svg>
  </div>
</div>

<style>
  .panel {
    flex: 1;
    display: flex;
    padding: 3.2rem;
    margin-top: -1px;
    border-top: 1px solid var(--color-1);
  }

  .piano {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  svg {
    height: 100%;
  }

  .octave-action-group {
    display: flex;
    flex-direction: column;
    align-self: center;
  }

  .octave-action-group span {
    padding-bottom: 1.6rem;
  }

  .actions {
    display: flex;
    flex-direction: column;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input {
    width: 6.4rem;
    text-align: center;
    color: var(--color-primary);
    background: var(--color-2);
  }

  .actions button,
  .actions input {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.6rem;
    border: 1px solid var(--color-2);
    margin-top: -1px;
  }
</style>
