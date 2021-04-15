<script>
  import { selected$, tracks$ } from '../stores/mixer'
  import { BoxGeometry, Mesh, RectAreaLight, MeshStandardMaterial } from 'three'
  import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
  import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'
  import { normalize as normalizeDecibels } from '../lib/decibels'

  import { getContext } from 'svelte'
  const { scene } = getContext('scene')

  const heightFrom = volume => normalizeDecibels(volume) * 16

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
      p.set(-i * width - spacing * i - width / 2 + getOffset(), 0, 16),
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

  $: $tracks$.forEach(({ volume, muted, id }, i) => {
    if ($selected$ === id) {
      lights[i].intensity = 3
    } else {
      lights[i].intensity = 1
    }
    lights[i].height = heightFrom(volume)
    muted ? lights[i].color.setHex(0x0c0c0c) : lights[i].color.setHex(0xffffff)
    volume > 0 && !muted && lights[i].color.setHex(0xff4400)
  })

  const cube = new Mesh(
    new BoxGeometry(0.5, 0.5, 0.5),
    new MeshStandardMaterial({ color: 0xffffff }),
  )
  scene.add(cube)

  selected$.subscribe(id => {
    if ($selected$ === -1) {
      cube.visible = false
    } else {
      cube.visible = true
      lights
        .filter(light => light.name === id)
        .forEach(light => {
          cube.position.x = light.position.x
          cube.position.y = light.position.y + 0.5
          cube.position.z = light.position.z - 0.5
        })
    }
  })
</script>
