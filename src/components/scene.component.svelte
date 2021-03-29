<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import {
    Clock,
    Color,
    Fog,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    PointLight,
    ReinhardToneMapping,
    sRGBEncoding,
  } from 'three'

  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
  import Stats from 'three/examples/jsm/libs/stats.module.js'
  import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
  import { settings as cameraSettings, position as cameraPosition } from '../stores/camera'
  import { resolution } from '../stores/vr'

  import GUI from './gui.component.svelte'
  import AmbientLighting from './ambient-lighting.component.svelte'
  import TorusKnot from './torus.component.svelte'
  import Floor from './floor.component.svelte'
  import ChannelLighting from './channel-strip-lighting.component.svelte'
  import Controls from './orbit-controls.component.svelte'

  let target
  let controls

  $: width = 0
  $: height = 0

  const { fov, near, far } = $cameraSettings

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
   * Configure camera
   */

  camera.position.set(...$cameraPosition)
  cameraPosition.subscribe(() => {
    camera.position.set(...$cameraPosition)
  })

  /*
   * Configure renderer
   */
  renderer.xr.enabled = true
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
      // Circling lights
      const time = clock.getElapsedTime()
      light.position.x = Math.sin(time * 8) * 8
      light.position.z = Math.cos(time * 8) * 8
      controls.update()
    }

    stats.end()
  })

  onMount(() => {
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

  onDestroy(() => {
    scene.remove.apply(scene, scene.children)
  })
</script>

<svelte:window on:resize={resize} />
<button on:click={() => console.log(camera.getWorldPosition())}>Camera position?</button>
<button on:click={() => console.log(camera.getWorldDirection())}>Camera lookat?</button>
<button on:click={() => cameraPosition.top()}>Top</button>
<button on:click={() => cameraPosition.front()}>front</button>
<div bind:this={target} on:resize={resize} bind:clientWidth={width} bind:clientHeight={height}>
  <Controls bind:controls />
  <Floor />
  <AmbientLighting />
  <ChannelLighting />
  <TorusKnot />
  <!--
  <Bloom />
  <select bind:value={$resolution} name="resolution">
    <option selected={$resolution === 1} value={1}>Full</option>
    <option selected={$resolution === 0.5} value={0.5}>Half</option>
    <option selected={$resolution === 0.25} value={0.25}>Quarter</option>
  </select>
  -->
  <GUI />
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
