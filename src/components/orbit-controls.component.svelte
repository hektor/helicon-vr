<script>
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import { getContext } from 'svelte'
  const { camera, renderer } = getContext('scene')

  const controls = new OrbitControls(camera, renderer.domElement)

  /*
   * Configure orbit controls
   */

  controls.maxPolarAngle = (80 * Math.PI) / 180
  // controls.maxAzimuthAngle = (5 * Math.PI) / 180;
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.update()
</script>
