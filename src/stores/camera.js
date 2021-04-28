import { writable } from 'svelte/store'

const defaults = {
  settings: { fov: 45, near: 0.01, far: 256 },
  position: [0, 0, -48],
}

const createSettings = init => {
  const { subscribe, set, update } = writable(init)

  return {
    subscribe,
    setFov: fov => update(state => ({ ...state, fov })),
    setNear: near => update(state => ({ ...state, near })),
    setFar: far => update(state => ({ ...state, far })),
    reset: () => set(defaults.settings),
  }
}

const createPosition = init => {
  const { subscribe, set } = writable(init)

  return {
    subscribe,
    top: () => set([0, 64, 48]),
    front: () => set([0, 0, -48]),
  }
}

export const settings = createSettings(defaults.settings)
export const position = createPosition(defaults.position)
