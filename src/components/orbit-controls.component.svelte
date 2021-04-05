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

  controls.target = new Vector3(0, 8, 0)
  controls.maxPolarAngle = rad(88) + Math.atan(8 / 48)
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
