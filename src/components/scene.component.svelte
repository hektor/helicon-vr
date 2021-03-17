<script>
  import { onMount, setContext } from 'svelte'
  import {
    Clock,
    Color,
    Fog,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    MeshBasicMaterial,
    Mesh,
    PointLight,
    ReinhardToneMapping,
    sRGBEncoding,
    SphereGeometry,
  } from 'three'

  import Stats from 'three/examples/jsm/libs/stats.module.js'
  import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
  import { settings } from '../stores/camera'

  import GUI from './gui.component.svelte'
  import Terrain from './terrain.component.svelte'
  import Bloom from './bloom.component.svelte'
  import Controls from './orbit-controls.component.svelte'

  let target

  $: width = 0
  $: height = 0

  const { fov, near, far } = $settings

  const scene = new Scene()
  const camera = new PerspectiveCamera(fov, width / height, near, far / 2)
  const light = new PointLight(0xffffff, 1, 16)
  const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  })
  const composer = new EffectComposer(renderer)
  const clock = new Clock() // Makes use of performance.now()
  const stats = new Stats()

  const sphere = new SphereGeometry(0.25, 16, 16)

  const resize = () => {
    renderer.setSize(width, height)
    composer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  /*
   * Add fog to scene (fade distant objects)
   */
  scene.fog = new Fog(0x111111, near, far)
  scene.background = new Color(0x0c0c0c)

  /*
   * Add lights to scene
   */
  light.add(new Mesh(sphere, new MeshBasicMaterial({ color: 0xffffff })))
  scene.add(light)

  sphere.translate(0, 8, 0)

  /*
   * Configure camera
   */
  camera.position.set(0, 32, 0)
  camera.lookAt(0, 0, 0)

  /*
   * Configure renderer
   */
  renderer.xr.enabled = true
  renderer.toneMapping = ReinhardToneMapping
  renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.physicallyCorrectLights
  // color accuracy
  renderer.gammaFactor = 2.2
  renderer.outputEncoding = sRGBEncoding

  /*
   * Use setAnimationLoop for WebXR (requestAnimationFrame equiv)
   */
  renderer.setAnimationLoop(() => {
    // Monitor performance of enclosed code (begin to end)
    stats.begin()
    {
      // Render scene
      composer.render(scene, camera)
      // Circling lights
      const time = clock.getElapsedTime()
      light.position.x = Math.sin(time * 8) * 8
      light.position.z = Math.cos(time * 8) * 8
    }
    stats.end()
  })

  onMount(() => {
    resize()
  })

  // Attach elements to DOM
  $: target && target.appendChild(renderer.domElement)
  $: target && target.appendChild(VRButton.createButton(renderer))
  $: target && target.appendChild(stats.dom)

  //Expose scene objects
  setContext('scene', {
    composer,
    renderer,
    scene,
    camera,
  })
</script>

<svelte:window on:resize={resize} bind:innerWidth={width} bind:innerHeight={height} />
<div bind:this={target}>
  <Controls />
  <GUI />
  <Terrain />
  <Bloom />
</div>
