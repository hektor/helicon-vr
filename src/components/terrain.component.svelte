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
    const spacing = 4
    light.position.set(-i * spacing + $tracks$.length + spacing / 2, 0)
    scene.add(light)
    return light
  })

  lights.forEach(light => {
    const helper = new RectAreaLightHelper(light)
    scene.add(helper)
  })

  $: $tracks$.forEach(({ volume, mute }, i) => {
    const normalizedVolume = (volume - -60) / (6 - -60)
    lights[i].height = normalizedVolume * 8
    if (mute) {
      lights[i].color.setHex(0x0c0c0c)
    } else {
      lights[i].color.setHex(0xffffff)
    }
    if (volume > 0) lights[i].color.setHex(0xff4400)
  })

  const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000)
  const matStdFloor = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
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

  const ambientLight = new THREE.AmbientLight(0xeeeeee, 1)
  scene.add(ambientLight)

  theme.subscribe(mode => {
    if (mode === 'dark') {
      scene.background.setHex(0x111111)
      ambientLight.visible = false
    } else {
      scene.background.setHex(0xeeeeee)
      ambientLight.visible = true
    }
  })
</script>
