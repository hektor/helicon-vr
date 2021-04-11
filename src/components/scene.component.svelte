<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import {
    Color,
    Clock,
    Fog,
    Scene,
    PerspectiveCamera,
    PointLight,
    WebGLRenderer,
    sRGBEncoding,
  } from 'three'

  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
  import Stats from 'three/examples/jsm/libs/stats.module.js'
  import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

  import { settings as cameraSettings, position as cameraPosition } from '../stores/camera'

  import AmbientLighting from './ambient-lighting.component.svelte'
  import Floor from './floor.component.svelte'
  import ChannelLighting from './channel-strip-lighting.component.svelte'
  import OrbitControls from './orbit-controls.component.svelte'
  import PointerLockControls from './pointer-lock-controls.component.svelte'
  import Sequencer from './sequencer.component.svelte'

  let target // canvas mount point
  let orbitControls // capture controls for update
  let pointerLockControls
  let locked
  let flow

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
    camera.position.set(...$cameraPosition)
  })

  /*
   * Configure renderer
   */

  renderer.xr.enabled = true
  // set pixelratio based on resolution settings
  // $: renderer.setPixelRatio(window.devicePixelRatio * $resolution)
  $: renderer.setPixelRatio(window.devicePixelRatio)
  // color accuracy
  renderer.physicallyCorrectLights
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
      // Sequencer
      if (flow) flow.moveAlongCurve(0.001)
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

    if (pointerLockControls) {
      console.log('Add', pointerLockControls)
      scene.add(pointerLockControls.getObject())
      // pointerLockControls.lock()
    }
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
    renderer.dispose()
  })
</script>

<!--Detect resizes (note: resize does not set window width)-->
<svelte:window on:resize={resize} />
<div
  class="scene"
  bind:this={target}
  on:resize={resize}
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <PointerLockControls bind:locked bind:controls={pointerLockControls} />
  <Floor />
  <AmbientLighting />
  <ChannelLighting />
  <Sequencer bind:flow />
  <!--
  <button on:click={() => console.log(camera.getWorldPosition())}>Camera position?</button>
  <button on:click={() => console.log(camera.getWorldDirection())}>Camera lookat?</button>
  <button on:click={() => cameraPosition.top()}>Top</button>
  <button on:click={() => cameraPosition.front()}>front</button>
  <Bloom />
  <GUI />
  -->
  {#if !locked}
    <div class="enter" on:click={() => pointerLockControls.lock()}>
      <div class="control-info">
        <div class="control">
          <span> Move up</span>
          <span><kbd>W</kbd>,<kbd>&#129121;</kbd></span>
        </div>
        <div class="control">
          <span> Move left</span>
          <span>
            <kbd>A</kbd>,<kbd>&#129128;</kbd>
          </span>
        </div>
        <div class="control">
          <span> Move down</span>
          <span>
            <kbd>S</kbd>,<kbd>&#129123;</kbd>
          </span>
        </div>
        <div class="control">
          <span> Move right</span>
          <span>
            <kbd>S</kbd>, <kbd>&#129122;</kbd>
          </span>
        </div>
        <button>Enter interactive mode</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .enter {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .control-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--color-bg);
    border: 1px solid var(--color-1);
  }

  .control {
    display: flex;
    padding: 1.6rem;
    border-width: 1px;
    border-color: var(--color-1);
    border-style: solid;
  }

  .control > * {
    flex: 1;
    display: flex;
    align-items: center;
  }

  button {
    padding: 1.6rem;
    background: var(--color-1);
    grid-column: 1 / -1;
    border: 1px solid var(--color-2);
  }

  .scene {
    flex: 1;
    display: flex;
    max-height: 100vh;
    max-width: 100vw;
    overflow: hidden;
  }
</style>
