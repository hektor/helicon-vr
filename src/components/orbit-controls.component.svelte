<script>
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import { getContext } from 'svelte'
  const { camera, renderer } = getContext('scene')

  export const controls = new OrbitControls(camera, renderer.domElement)

  /*
   * Configure orbit controls
   */

  controls.maxPolarAngle = (89.5 * Math.PI) / 180
  controls.maxDistance = 64
  controls.minDistance = 16
  controls.maxAzimuthAngle = -Math.PI / 2
  controls.minAzimuthAngle = Math.PI / 2
  controls.rotateSpeed = 0.5
  controls.zoomSpeed = 0.5
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.update()
</script>
