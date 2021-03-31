import { writable } from 'svelte/store'

const createSettings = init => {
  const { subscribe, set, update } = writable(init)

  return {
    subscribe,
    setFov: fov => update(state => ({ ...state, fov })),
    setNear: near => update(state => ({ ...state, near })),
    setFar: far => update(state => ({ ...state, far })),
    reset: () => set({ fov: 45, near: 1, far: 256 }),
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

export const settings = createSettings({ fov: 45, near: 0.1, far: 256 })
export const position = createPosition([0, 0, -48])
