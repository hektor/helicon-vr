import { writable } from 'svelte/store'

const createSettings = init => {
  const { subscribe, set, update } = writable(init)

  return {
    subscribe,
    setFov: fov => update(state => ({ ...state, fov })),
    setNear: near => update(state => ({ ...state, near })),
    setFar: far => update(state => ({ ...state, far })),
    reset: () => set({ fov: 45, near: 1, far: 100 }),
  }
}

export const settings = createSettings({ fov: 45, near: 1, far: 100 })
