<script>
  import { Vector3 } from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import { getContext } from 'svelte'
  const { camera, renderer } = getContext('scene')

  import { interacting } from '../stores/vr-controls'
  import { rad } from '../lib/trig'

  export const controls = new OrbitControls(camera, renderer.domElement)

  /*
   * Configure orbit controls
   */

  camera.position.set(0, 64, -16)
  camera.lookAt(0, 0, -16)
  controls.update()
  controls.maxPolarAngle = rad(88)
  controls.maxDistance = 64
  controls.minDistance = 16
  controls.maxAzimuthAngle = -rad(90)
  controls.minAzimuthAngle = rad(90)
  controls.rotateSpeed = 0.5
  controls.zoomSpeed = 0.5
  controls.enableDamping = true
  controls.dampingFactor = 0.075
  controls.enablePan = false
  $: controls.enabled = !$interacting
</script>
