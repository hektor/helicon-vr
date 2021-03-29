<script>
  import { onMount, setContext } from 'svelte'
  import {
    Clock,
    Color,
    Fog,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    PointLight,
    sRGBEncoding,
    Vector3,
  } from 'three'

  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
  import Stats from 'three/examples/jsm/libs/stats.module.js'
  import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

  import { settings as cameraSettings, position as cameraPosition } from '../stores/camera'
  import { resolution } from '../stores/vr'

  import AmbientLighting from './ambient-lighting.component.svelte'
  import TorusKnot from './torus.component.svelte'
  import Floor from './floor.component.svelte'
  import ChannelLighting from './channel-strip-lighting.component.svelte'
  import Controls from './orbit-controls.component.svelte'

  let target // canvas mount point
  let controls // capture controls for update

  $: width = 0 // canvas parent width
  $: height = 0 // canvas parent height

  const { fov, near, far } = $cameraSettings

  /*
   * Instantiate Scene objects
   */

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

  /*
   * Canvas parent resize handler
   */

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
   * Configure camera, handle updates
   */

  cameraPosition.subscribe(() => {
    if (controls) controls.enabled = false
    if (controls) controls.target = new Vector3(0, 16, 0)
    camera.position.set(...$cameraPosition)
    if (controls) controls.enabled = true
  })

  /*
   * Configure renderer
   */

  renderer.xr.enabled = true
  // set pixelratio based on resolution settings
  $: renderer.setPixelRatio(window.devicePixelRatio * $resolution)
  // color accuracy
  renderer.physicallyCorrectLights
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
      // Control damping is enabled
      controls.update()
    }
    stats.end()
  })

  onMount(() => {
    // Handle the initial size
    resize()

    // Attach elements to DOM
    target && target.appendChild(renderer.domElement)
    target && target.appendChild(VRButton.createButton(renderer))
    target && target.appendChild(stats.dom)
  })

  //Expose scene objects
  setContext('scene', {
    composer,
    renderer,
    scene,
    camera,
  })

  composer.addPass(new RenderPass(scene, camera))
</script>

<!--Detect resizes (note: resize does not set window width)-->
<svelte:window on:resize={resize} />

<div bind:this={target} on:resize={resize} bind:clientWidth={width} bind:clientHeight={height}>
  <Controls bind:controls />
  <Floor />
  <AmbientLighting />
  <ChannelLighting />
  <TorusKnot />
  <!--
  <button on:click={() => console.log(camera.getWorldPosition())}>Camera position?</button>
  <button on:click={() => console.log(camera.getWorldDirection())}>Camera lookat?</button>
  <button on:click={() => cameraPosition.top()}>Top</button>
  <button on:click={() => cameraPosition.front()}>front</button>
  <Bloom />
  <GUI />
  -->
</div>

<style>
  div {
    flex: 1;
    display: flex;
    max-height: 100vh;
    max-width: 100vw;
    overflow: hidden;
  }
</style>
