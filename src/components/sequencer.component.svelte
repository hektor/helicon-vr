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
    Color,
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
    tracks$,
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

  const data = $sequencer$.map((sequencer, i) =>
    sequencer.cycles.map(({ steps }, j) =>
      regularPolygon(steps, 8, rad(-90)).map(point => ({
        x: point[0] + i * 20,
        y: j * 8 + 2,
        z: point[1],
      })),
    ),
  )

  const curveGroups = data.map((curveGroup, i) =>
    curveGroup.map(curvePoints => {
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

      scene.add(line)
      scene.add(handleGroup)

      return { curve, line, handleGroup }
    }),
  )

  export let flows = curveGroups.map(g => new InstancedFlow(g.length, g.length, geo, mat))

  const offset = tweened(20, {
    duration: 150,
    easing: cubicOut,
  })
  $: offset.set($selected$ === -1 ? 1 : $selected$)
  $: curveGroups.forEach(group =>
    group.forEach(({ line, handleGroup }) => {
      line.position.x = -$tracks$.length * 20 + 20 * $offset
      handleGroup.position.x = -$tracks$.length * 20 + 20 * $offset
    })
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

  latestAddedTrack$.subscribe(track => track && addSequence(track))
  latestRemovedTrack$.subscribe(track => track && removeSequence(track))

  const [added, removed] = sequencer$.pipe(
    distinct(),
    pairwise(),
    partition(([a, b]) => a < b),
  )

  added
    .pipe(
      map(([a, b]) => arrDiff(b, a)),
      map(arrFirst),
    )
    .subscribe(({ cycles }) => {
      const data = cycles.map(({ steps }, j) =>
        regularPolygon(steps, 8, rad(-90)).map(point => ({
          x: point[0] + $sequencer$.length * 20,
          y: j * 8 + 2,
          z: point[1],
        })),
      )

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
          new LineBasicMaterial({ color: colors.gray1 }),
        )

        scene.add(line)
        scene.add(handleGroup)

        line.position.x = -$tracks$.length * 20 + 20 * $offset
        handleGroup.position.x = -$tracks$.length * 20 + 20 * $offset

        return { curve, line, handleGroup }
      })
    })

  removed
    .pipe(
      map(([a, b]) => arrDiff(a, b)),
      map(arrFirst),
    )
    .subscribe(removed => console.log('Removed', removed))

  // TODO: Create one flow in center position
  // TODO: Link flow to currently active using updateCurve
  $: flows.forEach(flow => {})

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
      flows[i].object3D.setColorAt(j, new Color(0xff0000))
    }
  }

  control = new TransformControls(camera, renderer.domElement)
  control.showX = false
  control.showZ = false
  control.translationSnap = 1
  // Translation constraints
  control.addEventListener('change', () => {
    control.object.position.clamp(new Vector3(-100, 1, -100), new Vector3(100, 24, 100))
  })

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

  theme.subscribe(mode => {
    flows.forEach(flow =>
      flow.object3D.material.color.setHex(mode === 'light' ? 0x111111 : 0xcccccc),
    )

    matActive.color.setHex(mode === 'light' ? 0x000000 : 0xffffff)
    mat.color.setHex(mode === 'light' ? 0x444444 : 0x111111)
  })

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
</script>
