<script>
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import * as THREE from 'three'
  import { InstancedFlow } from 'three/examples/jsm/modifiers/CurveModifier'
  import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
  import {
    OctahedronGeometry,
    BufferGeometry,
    CatmullRomCurve3,
    Mesh,
    MeshBasicMaterial,
    LineBasicMaterial,
    LineLoop,
    Raycaster,
    Vector2,
    Vector3,
  } from 'three'
  import { getContext } from 'svelte'
  const { scene, renderer, camera } = getContext('scene')

  import {
    latestAdded$ as latestAddedTrack$,
    latestRemoved$ as latestRemovedTrack$,
    selected$,
  } from '../stores/mixer'
  import { sequencer$ } from '../stores/euclid-sequencer'
  import { interacting } from '../stores/vr-controls'
  import { theme } from '../stores/theme'

  import { rad } from '../lib/trig'
  import { regularPolygon } from '../lib/regular-polygon'

  const colors = {
    white: 0xffffff,
    gray1: 0x333333,
    gray2: 0x555555,
    gray3: 0xaaaaaa,
    white: 0xffffff,
  }

  let control, target, action
  const handles = []
  const mouse = new Vector2(0, 0)
  const raycaster = new Raycaster()

  // Create geometry
  const geo = new OctahedronGeometry(0.5)
  const mat = new MeshBasicMaterial({ color: colors.gray2, wireframe: true })
  const matActive = new MeshBasicMaterial({ color: colors.white })

  /*
   * Get all polygon data
   * Every point of every polygon of every cycle of every track
   *
   * Space points on xz-plane
   * Space cycles on y-axis
   */

  const data = $sequencer$.map(({ cycles, id }, i) => ({
    id,
    geo: cycles.map(({ steps }, j) =>
      regularPolygon(steps, 8, rad(-90)).map(point => ({
        x: point[0] - i * 20,
        y: j * 8 + 2,
        z: point[1],
      })),
    ),
  }))

  let curveGroups = data.map(curveGroup =>
    curveGroup.geo.map(curvePoints => {
      const handleGroup = new THREE.Group()
      const curve = new CatmullRomCurve3(
        curvePoints.map(position => {
          const handle = new Mesh(geo, mat)
          handle.position.copy(position)
          handles.push(handle)
          handleGroup.add(handle)
          return handle.position
        }),
      )

      curve.tension = 0
      curve.curveType = 'catmullrom'
      curve.closed = true

      const line = new LineLoop(
        new BufferGeometry().setFromPoints(curve.getPoints(32)),
        new LineBasicMaterial({ color: colors.gray1 }),
      )

      line.name = curveGroup.id
      curve.name = curveGroup.id
      handleGroup.name = curveGroup.id

      return { curve, line, handleGroup }
    }),
  )

  export let flows = curveGroups.map(g => new InstancedFlow(g.length, g.length, geo, matActive))

  const offset = tweened(0, {
    duration: 150,
    easing: cubicOut,
  })

  const reId = (obj, id) => ({ ...obj, id: id + 1 })

  $: next = {
    id: $sequencer$.length + 1,
    cycles: [
      {
        steps: 16,
        pulses: 3,
      },
      {
        steps: 16,
        pulses: 2,
      },
      {
        steps: 16,
        pulses: 5,
      },
    ],
  }

  const addSequence = () => sequencer$.next([...$sequencer$, next])
  const removeSequence = ({ id }) =>
    sequencer$.next($sequencer$.filter(sequencer => sequencer.id !== id).map(reId))

  const addSequenceToScene = sequencer => {
    const data = sequencer.cycles.map(({ steps }, j) =>
      regularPolygon(steps, 8, rad(-90)).map(point => ({
        x: point[0] - ($sequencer$.length - 1) * 20,
        y: j * 8 + 2,
        z: point[1],
      })),
    )
    curveGroups = [
      ...curveGroups,
      data.map(curvePoints => {
        const handleGroup = new THREE.Group()
        const curve = new CatmullRomCurve3(
          curvePoints.map(position => {
            const handle = new Mesh(geo, mat)
            handle.position.copy(position)
            handles.push(handle)
            handleGroup.add(handle)
            return handle.position
          }),
        )

        curve.tension = 0
        curve.curveType = 'catmullrom'
        curve.closed = true

        const line = new LineLoop(
          new BufferGeometry().setFromPoints(curve.getPoints(32)),
          new LineBasicMaterial({ color: 0xff0000 }),
        )

        curve.name = $sequencer$.length
        line.name = $sequencer$.length
        handleGroup.name = $sequencer$.length

        return { curve, line, handleGroup }
      }),
    ]
  }

  const removeSequenceFromScene = ({ id }) => {
    /* Remove references */
    curveGroups = curveGroups.filter((_, i) => i !== id - 1)
    /* Remove from scene */
    sequencerGroup.children.filter(({ name }) => name === id).forEach(child => child.remove())
    /* Close the gap */
    sequencerGroup.children.filter(({ name }) => name > id).forEach(child => child.translateX(20))
    /* Remove from group */
    sequencerGroup.children = sequencerGroup.children.filter(({ name }) => name !== id)
    /* Close ID gaps */
    sequencerGroup.children
      .filter(({ name }) => name > id)
      .forEach(child => (child.name = child.name - 1))
  }

  latestAddedTrack$.subscribe(track => {
    if (track) {
      addSequence(track)
      addSequenceToScene($sequencer$[$sequencer$.length - 1])
    }
  })
  latestRemovedTrack$.subscribe(track => {
    if (track) {
      removeSequence(track)
      removeSequenceFromScene(track)
    }
  })

  $: curveGroups.forEach(group =>
    group.forEach(({ line, handleGroup }) => {
      sequencerGroup.add(line)
      sequencerGroup.add(handleGroup)
    }),
  )

  const sequencerGroup = new THREE.Group()

  selected$.subscribe(selected => {
    if (selected === -1) {
      offset.set(0)
    } else {
      offset.set(($selected$ - 1) * 20)
    }
  })
  scene.add(sequencerGroup)

  $: sequencerGroup.position.x = $offset

  for (let i = 0; i < curveGroups.length; i++) {
    curveGroups[i].forEach(({ curve }, j) => {
      flows[i].updateCurve(j, curve)
      scene.add(flows[i].object3D)
    })
  }

  for (let i = 0; i < curveGroups.length; i++) {
    for (let j = 0; j < curveGroups[i].length; j++) {
      flows[i].setCurve(j, j % curveGroups[i].length)
      flows[i].moveIndividualAlongCurve(j, 0)
      // flows[i].object3D.setColorAt(j, new Color(0xffffff))
    }
  }

  control = new TransformControls(camera, renderer.domElement)
  control.showX = false
  control.showZ = false
  control.translationSnap = 1
  control.rotationSnap = false

  const renderActive = target => {
    if (target) {
      target.material = matActive
      target.scale.set(1.5, 1.5, 1.5)
    }
  }
  const renderInactive = target => {
    if (target) {
      target.material = mat
      target.scale.set(1, 1, 1)
    }
  }

  const setTarget = x => (target = x)

  $: {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(handles)
    if (intersects.length) {
      if (target !== intersects[0].object) {
        renderInactive(target)
        setTarget(intersects[0].object) // new target
      }
    } else {
      renderInactive(target)
      setTarget(null)
    }
  }

  $: renderActive(target)

  $: if (action) {
    action = false
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(handles)
    if (intersects.length) {
      control.attach(target)
      scene.add(control)
    }
  }

  /*
   * Theme handling
   */

  theme.subscribe(mode => {
    const getFlowColor = () => (mode === 'light' ? 0x111111 : 0xcccccc)
    flows.forEach(flow => flow.object3D.material.color.setHex(getFlowColor(mode)))
    matActive.color.setHex(mode === 'light' ? 0x000000 : 0xffffff)
    mat.color.setHex(mode === 'light' ? 0x444444 : 0x111111)
  })

  /*
   * Event handling
   */

  const onPointerDown = () => (action = true)
  const onMouseMove = ({ offsetX: x, offsetY: y }) => updateMousePosition({ x, y })

  const updateMousePosition = ({ x, y }) => {
    mouse.x = (x / renderer.domElement.width) * 2 - 1
    mouse.y = -(y / renderer.domElement.height) * 2 + 1
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('mousemove', onMouseMove)

  control.addEventListener('mouseDown', () => interacting.set(true))
  control.addEventListener('mouseUp', () => interacting.set(false))
  control.addEventListener('dragging-changed', ({ value }) => {
    if (!value) {
      for (let i = 0; i < curveGroups.length; i++) {
        curveGroups[i].forEach(({ curve, line }, j) => {
          line.geometry.setFromPoints(curve.getPoints(50))
          flows[i].updateCurve(j, curve)
        })
      }
    }
  })

  // Translation constraints
  control.addEventListener('change', () => {
    control.object.position.clamp(new Vector3(-100, 1, -100), new Vector3(100, 24, 100))
  })
</script>
