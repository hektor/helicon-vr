<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import { Color, Clock, Fog, Scene, PerspectiveCamera, WebGLRenderer, sRGBEncoding } from 'three'
  import * as THREE from 'three'

  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
  import Stats from 'three/examples/jsm/libs/stats.module.js'
  import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
  import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js'
  import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js'
  import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry'

  import { settings as cameraSettings } from '../stores/camera'
  import { theme } from '../stores/theme'

  import Helicopter16 from 'carbon-icons-svelte/lib/Helicopter16'
  import NavaidMilitary16 from 'carbon-icons-svelte/lib/NavaidMilitary16'

  import AmbientLighting from './ambient-lighting.component.svelte'
  import Floor from './floor.component.svelte'
  import ChannelLighting from './channel-strip-lighting.component.svelte'
  import OrbitControls from './orbit-controls.component.svelte'
  import PointerLockControls from './pointer-lock-controls.component.svelte'
  import PointerLockControlsInfo from './pointer-lock-controls-info.component.svelte'
  import Sequencer from './sequencer.component.svelte'

  let target // canvas mount point
  let selectedControls = 'orbit'
  // Preview controls (orbit or pointerlock)
  let controls // capture controls for update
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
  const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  })
  const composer = new EffectComposer(renderer)
  const clock = new Clock() // Makes use of performance.now()
  const stats = new Stats()

  const dolly = new THREE.Group()
  scene.add(dolly)

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

  const room = new THREE.LineSegments(
    new BoxLineGeometry(128, 128, 128, 16, 16, 16),
    new THREE.LineBasicMaterial({ color: 0x111111 }),
  )
  scene.add(room)

  /*
   * Controllers
   */

  const buildController = ({ targetRayMode }) => {
    let geometry, material
    switch (targetRayMode) {
      case 'tracked-pointer':
        geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3))
        geometry.setAttribute('color', new THREE.Float32BufferAttribute([1, 1, 1, 0, 0, 0], 3))
        material = new THREE.LineBasicMaterial({
          vertexColors: true,
          blending: $theme === 'light' ? THREE.SubtractiveBlending : THREE.AdditiveBlending,
        })

        return new THREE.Line(geometry, material)
      case 'gaze':
        geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, -1)
        material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true })
        return new THREE.Mesh(geometry, material)
    }
  }

  const handleController = controller =>
    controller.userData.isSelecting && console.log('Controller', controller)

  let controller1Selecting = false
  let controller2Selecting = false

  $: console.log('Controller selection', { controller1Selecting, controller2Selecting })

  controller1 = renderer.xr.getController(0)
  controller1.addEventListener('selectstart', () => (controller1Selecting = true))
  controller1.addEventListener('selectend', () => (controller1Selecting = false))
  controller1.addEventListener('connected', function ({ data }) {
    this.add(buildController(data))
  })
  controller1.addEventListener('disconnected', function () {
    this.remove(this.children[0])
  })
  controller2 = renderer.xr.getController(1)
  controller2.addEventListener('selectstart', () => (controller2Selecting = true))
  controller2.addEventListener('selectend', () => (controller2Selecting = false))
  controller2.addEventListener('connected', function ({ data }) {
    this.add(buildController(data))
  })
  controller2.addEventListener('disconnected', function () {
    this.remove(this.children[0])
  })

  scene.add(controller1)
  scene.add(controller2)

  const controllerModelFactory = new XRControllerModelFactory()

  controllerGrip1 = renderer.xr.getControllerGrip(0)
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))

  controllerGrip2 = renderer.xr.getControllerGrip(1)
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))

  scene.add(controllerGrip1)
  scene.add(controllerGrip2)

  const handModelFactory = new XRHandModelFactory().setPath('./models/fbx/')

  hand1 = renderer.xr.getHand(0)
  hand1.add(handModelFactory.createHandModel(hand1, 'boxes'))

  hand2 = renderer.xr.getHand(1)
  hand2.add(handModelFactory.createHandModel(hand2, 'boxes'))

  scene.add(hand1)
  scene.add(hand2)

  /*
   * Add VR headset, controls and hands to dolly
   */

  dolly.add(camera)
  dolly.add(controller1)
  dolly.add(controller2)
  dolly.add(controllerGrip1)
  dolly.add(controllerGrip2)
  dolly.add(hand1)
  dolly.add(hand2)

  renderer.xr.addEventListener('sessionstart', () => {
    // dolly.position.set(0, 1.6, -32)
    dolly.position.set(8, 2.5, -12)
    dolly.lookAt(0, 0, -64)
  })

  /*
   * Controller raycasting
   */

  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1),
  ])

  const line = new THREE.Line(geo)
  line.name = 'line'
  line.scale.z = 5

  controller1.add(line.clone())
  controller2.add(line.clone())

  let intersected, hover

  const tempMatrix = new THREE.Matrix4()
  const raycaster = new THREE.Raycaster()

  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 })
  const boxActiveMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

  const getIntersections = controller => {
    tempMatrix.identity().extractRotation(controller.matrixWorld)
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld)
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix)
    return raycaster.intersectObjects(scene.children)
  }

  const intersectObjects = controller => {
    // TODO: Split controllers
    const line = controller.getObjectByName('line')
    const intersections = getIntersections(controller)
    const object = intersections[0].object
    if (intersections.length) {
      if (intersected !== object) {
        intersected && (intersected.material = boxMaterial)
        intersected = object
      }
    } else {
      intersected && (intersected.material = boxMaterial)
      intersected = null
    }
  }

  $: intersected && (intersected.material = boxActiveMaterial)

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

      // XR controller intersections
      if (renderer.xr.isPresenting) {
        intersectObjects(controller1)
        intersectObjects(controller2)
      }

      // Control damping is enabled
      if (selectedControls === 'orbit') controls.update()
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

    if (selectedControls === 'pointerlock') {
      scene.add(controls.getObject())
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
  {#if selectedControls === 'pointerlock'}
    <PointerLockControls bind:locked bind:controls />
  {:else}
    <OrbitControls bind:controls />
  {/if}
  <Floor />
  <AmbientLighting />
  <ChannelLighting />
  <Sequencer bind:flow />
  <!--
  <Bloom />
  <GUI />
  -->

  {#if !locked && selectedControls === 'pointerlock'}
    <PointerLockControlsInfo>
      <button on:click={() => controls.lock()}>Enter interactive mode</button>
    </PointerLockControlsInfo>
  {/if}
  <details class="preview">
    <summary>Preview</summary>
    <div>
      <button
        id="orbit"
        on:click={() => (selectedControls = 'orbit')}
        class:preview-active={selectedControls === 'orbit'}
      >
        <Helicopter16 />
        <label for="orbit">Overview</label>
      </button>
    </div>
    <div>
      <button
        id="pointerlock"
        on:click={() => (selectedControls = 'pointerlock')}
        class:preview-active={selectedControls === 'pointerlock'}
      >
        <NavaidMilitary16 />
        <label for="pointerlock">First person</label>
      </button>
    </div>
  </details>
</div>

<style>
  .scene {
    flex: 1;
    display: flex;
    max-height: 100vh;
    max-width: 100vw;
    overflow: hidden;
  }

  button {
    padding: 1.6rem;
    background: var(--color-1);
    grid-column: 1 / -1;
    border: 1px solid var(--color-2);
  }

  .preview {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    background: var(--color-bg);
    border: 1px solid var(--color-1);
    border-bottom: none;
    padding: 0.8rem;
  }

  .preview > summary {
    padding: 0.8rem;
  }

  .preview > div {
    flex: 1;
    display: flex;
  }

  .preview > div:not(:last-child) {
    margin: 0.8rem 0;
  }

  .preview button {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .preview-active {
    background: var(--color-primary);
    color: var(--color-bg);
  }
</style>
