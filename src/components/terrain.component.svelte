<script>
  import { tracks$ } from '../stores/mixer'
  import * as THREE from 'three'
  /* import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' */
  import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
  import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'

  import { theme } from '../stores/theme'

  import { getContext } from 'svelte'
  const { scene } = getContext('scene')

  RectAreaLightUniformsLib.init()

  const lights = $tracks$.map(({ volume }, i) => {
    const normalizedVolume = (volume - -60) / (6 - -60)
    const light = new THREE.RectAreaLight(0xffffff, 4, 2, normalizedVolume * 8)
    light.position.set(-i * 4 + $tracks$.length * 2, 0)
    scene.add(light)
    scene.add(new RectAreaLightHelper(light))
    return light
  })

  $: $tracks$.forEach(({ volume }, i) => {
    const normalizedVolume = (volume - -60) / (6 - -60)
    lights[i].height = normalizedVolume * 8
  })

  /*   const normalizedVolume = (volume - -60) / (6 - -60) */
  /*   const light = new THREE.RectAreaLight(0xffffff, 4, 2, normalizedVolume * 8) */
  /*   light.position.set(-i * 4 + $tracks$.length * 2, 0) */
  /*   scene.add(light) */
  /*   scene.add(new RectAreaLightHelper(light)) */
  /* }) */

  /* const rectLight1 = new THREE.RectAreaLight(0xffffff, 4, 4, 8) */
  /* rectLight1.position.set(-8, 2, 4) */

  /* const rectLight2 = new THREE.RectAreaLight(0xffffff, 4, 4, 8) */
  /* rectLight2.position.set(0, 4, 4) */

  /* const rectLight3 = new THREE.RectAreaLight(0xffffff, 4, 4, 8) */
  /* rectLight3.position.set(8, 2, 4) */

  /* scene.add(rectLight1) */
  /* scene.add(rectLight2) */
  /* scene.add(rectLight3) */

  /* scene.add(new RectAreaLightHelper(rectLight1)) */
  /* scene.add(new RectAreaLightHelper(rectLight2)) */
  /* scene.add(new RectAreaLightHelper(rectLight3)) */

  const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000)
  const matStdFloor = new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0.1,
    metalness: 0,
  })

  const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor)
  scene.add(mshStdFloor)

  const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16)
  const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 })
  const meshKnot = new THREE.Mesh(geoKnot, matKnot)
  meshKnot.name = 'meshKnot'
  meshKnot.position.set(Math.random(5), 5, 0)
  scene.add(meshKnot)

  /* const loader = new GLTFLoader().setPath('/') */
  /* loader.load('terrain.glb', function (gltf) { */
  /*   gltf.scene.matrixAutoUpdate = false */
  /*   scene.add(gltf.scene) */
  /* }) */

  theme.subscribe(mode => {
    if (mode === 'dark') {
      matStdFloor.color.setHex(0x808080)
      /* rectLight1.intensity = 1 */
      /* rectLight2.intensity = 1 */
      /* rectLight3.intensity = 1 */
    } else {
      matStdFloor.color.setHex(0xffffff)
      /* rectLight1.intensity = 10 */
      /* rectLight2.intensity = 10 */
      /* rectLight3.intensity = 10 */
    }
  })
</script>
