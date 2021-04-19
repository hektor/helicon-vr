<script>
  import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
  import { getContext } from 'svelte'
  const { camera, renderer } = getContext('scene')

  import { rad } from '../lib/trig'

  export let locked
  export const controls = new PointerLockControls(camera, renderer.domElement)

  camera.position.set(0, 1.6, 0)
  camera.lookAt(0, 2, 16)
  controls.maxPolarAngle = rad(88) + Math.atan(8 / 48)
  controls.minAzimuthAngle = rad(90)

  let forward,
    backward,
    left,
    right = false

  const handleKeydown = ({ code }) => {
    switch (code) {
      case 'ArrowUp':
      case 'KeyW':
        forward = true
        break
      case 'ArrowLeft':
      case 'KeyA':
        left = true
        break
      case 'ArrowDown':
      case 'KeyS':
        backward = true
        break
      case 'ArrowRight':
      case 'KeyD':
        right = true
        break
    }
  }

  /*
   * Configure pointer lock controls
   */

  controls.addEventListener('lock', function () {
    console.log('lock')
    locked = true
  })

  controls.addEventListener('unlock', function () {
    locked = false
  })
</script>

<svelte:window on:keydown={handleKeydown} />
