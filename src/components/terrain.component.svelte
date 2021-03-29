<script>
  import { tracks$ } from '../stores/mixer'
  import * as THREE from 'three'
  import { RectAreaLight } from 'three'
  import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
  import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'

  import { theme } from '../stores/theme'

  import { getContext } from 'svelte'
  const { scene } = getContext('scene')

  const normalizeFaderRange = dB => (dB - -60) / (6 - -60)
  const heightFrom = volume => normalizeFaderRange(volume) * 8

  RectAreaLightUniformsLib.init()

  const spacing = 1
  const width = 2
  const getOffset = () => ($tracks$.length * width + $tracks$.length * spacing) / 2

  /*
   * Create and return initial array for lights and helpers
   */

  let lights = $tracks$.map(() => new RectAreaLight(0xffffff, 2, width))
  let helpers = lights.map(light => new RectAreaLightHelper(light))

  const indexLights = () =>
    lights.forEach((light, i) => {
      light.name = $tracks$[i].id
    })

  const indexHelpers = () =>
    helpers.forEach((helper, i) => {
      helper.name = $tracks$[i].id
    })

  const addLights = () => lights.forEach(light => scene.add(light))
  const addLightHelpers = () => helpers.forEach(helper => scene.add(helper))

  /*
   * Set light positions so they are centered to scene
   */

  const updateLightPositions = () =>
    lights.forEach(({ position: p }, i) =>
      p.set(-i * width - spacing * i - width / 2 + getOffset(), 0),
    )

  updateLightPositions()
  indexLights()
  indexHelpers()
  addLights()
  addLightHelpers()

  $: {
    if ($tracks$ > lights) {
      const light = new RectAreaLight(0x00ff00, 2, width)
      const helper = new RectAreaLightHelper(light)
      light.name = $tracks$.length
      helper.name = $tracks$.length
      lights = [...lights, light]
      helpers = [...helpers, helper]
      scene.add(light)
      scene.add(helper)
    }
    if ($tracks$ < lights) {
      const trackIds = $tracks$.map(({ id }) => id)
      const lightIds = lights.map(({ name }) => name)
      const helperIds = helpers.map(({ name }) => name)

      const diffLights = lightIds.filter(x => !trackIds.includes(x))
      lights.filter(light => {
        if (diffLights.includes(light.name)) {
          light.visible = false
        }
      })

      const diffHelpers = helperIds.filter(x => !trackIds.includes(x))
      helpers.filter(helper => {
        if (diffHelpers.includes(helper.name)) {
          helper.visible = false
        }
      })

      lights = lights.filter(light => !diffLights.includes(light.name))
      helpers = helpers.filter(helper => !diffHelpers.includes(helper.name))
    }
    updateLightPositions()
  }

  $: $tracks$.forEach(({ volume, mute }, i) => {
    lights[i].height = heightFrom(volume)
    mute ? lights[i].color.setHex(0x0c0c0c) : lights[i].color.setHex(0xffffff)
    volume > 0 && lights[i].color.setHex(0xff4400)
  })

  const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000)
  const matStdFloor = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.2,
    metalness: 0,
  })

  const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor)
  scene.add(mshStdFloor)

  const geoKnot = new THREE.TorusKnotGeometry(8, 0.25, 128, 8)
  const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 1 })
  const meshKnot = new THREE.Mesh(geoKnot, matKnot)
  meshKnot.name = 'meshKnot'
  meshKnot.position.set(0, 12, -8)
  scene.add(meshKnot)

  const ambientLight = new THREE.AmbientLight(0xeeeeee, 1.25)
  scene.add(ambientLight)

  theme.subscribe(mode => {
    if (mode === 'dark') {
      scene.background.setHex(0x111111)
      ambientLight.color.setHex(0x111111)
      ambientLight.intensity = 0.125
    } else {
      scene.background.setHex(0xeeeeee)
      ambientLight.color.setHex(0xeeeeee)
      ambientLight.intensity = 1.25
    }
  })
</script>
