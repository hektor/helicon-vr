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

  import * as THREE from 'three'

  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
  import Stats from 'three/examples/jsm/libs/stats.module.js'
  import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
  import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js'
  import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js'
  import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js'

  import { settings as cameraSettings, position as cameraPosition } from '../stores/camera'

  import AmbientLighting from './ambient-lighting.component.svelte'
  import Floor from './floor.component.svelte'
  import ChannelLighting from './channel-strip-lighting.component.svelte'
  import OrbitControls from './orbit-controls.component.svelte'
  import PointerLockControls from './pointer-lock-controls.component.svelte'
  import Sequencer from './sequencer.component.svelte'

  let target // canvas mount point
  // Preview controls
  let orbitControls // capture controls for update
  // 360 experience controls
  let pointerLockControls
  // VR controls
  let controller1, controller2
  let controllerGrip1, controllerGrip2
  // VR hands
  let hand1, hand2

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

  const room = new THREE.LineSegments(
    new BoxLineGeometry(6, 6, 6, 10, 10, 10),
    new THREE.LineBasicMaterial({ color: 0x808080 }),
  )
  room.geometry.translate(0, 3, 0)
  scene.add(room)

  /*
   * Controllers
   */

  function onSelectStart() {
    this.userData.isSelecting = true
  }

  function onSelectEnd() {
    this.userData.isSelecting = false
  }

  function buildController(data) {
    let geometry, material

    switch (data.targetRayMode) {
      case 'tracked-pointer':
        geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3))
        geometry.setAttribute(
          'color',
          new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3),
        )
        material = new THREE.LineBasicMaterial({
          vertexColors: true,
          blending: THREE.AdditiveBlending,
        })

        return new THREE.Line(geometry, material)
      case 'gaze':
        geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, -1)
        material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true })
        return new THREE.Mesh(geometry, material)
    }
  }

  function handleController(controller) {
    if (controller.userData.isSelecting) {
      console.log(controller)
    }
  }

  controller1 = renderer.xr.getController(0)
  controller1.addEventListener('selectstart', onSelectStart)
  controller1.addEventListener('selectend', onSelectEnd)
  controller1.addEventListener('connected', function (event) {
    this.add(buildController(event.data))
  })
  controller1.addEventListener('disconnected', function () {
    this.remove(this.children[0])
  })
  scene.add(controller1)

  controller2 = renderer.xr.getController(1)
  controller2.addEventListener('selectstart', onSelectStart)
  controller2.addEventListener('selectend', onSelectEnd)
  controller2.addEventListener('connected', function (event) {
    this.add(buildController(event.data))
  })
  controller2.addEventListener('disconnected', function () {
    this.remove(this.children[0])
  })
  scene.add(controller2)

  const controllerModelFactory = new XRControllerModelFactory()

  controllerGrip1 = renderer.xr.getControllerGrip(0)
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
  scene.add(controllerGrip1)

  controllerGrip2 = renderer.xr.getControllerGrip(1)
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
  scene.add(controllerGrip2)

  const handModelFactory = new XRHandModelFactory().setPath('./models/fbx/')

  // Hand 1
  controllerGrip1 = renderer.xr.getControllerGrip(0)
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
  scene.add(controllerGrip1)

  hand1 = renderer.xr.getHand(0)
  hand1.add(handModelFactory.createHandModel(hand1, 'boxes'))

  scene.add(hand1)

  // Hand 2
  controllerGrip2 = renderer.xr.getControllerGrip(1)
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
  scene.add(controllerGrip2)

  hand2 = renderer.xr.getHand(1)
  hand2.add(handModelFactory.createHandModel(hand2, 'boxes'))
  scene.add(hand2)

  //

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
      handleController(controller1)
      handleController(controller2)
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
