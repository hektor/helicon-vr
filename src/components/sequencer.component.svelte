<script>
  import { delay } from 'rxjs/operators'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { Group } from 'three'
  import { InstancedFlow } from 'three/examples/jsm/modifiers/CurveModifier'
  // import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
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
  import { rhythms$ } from '../stores/rhythms'
  import { theme } from '../stores/theme'

  import { rad } from '../lib/trig'
  import { regularPolygon } from '../lib/regular-polygon'

  const colors = {
    white: 0xffffff,
    gray1: 0x333333,
    gray2: 0x555555,
    gray3: 0xcccccc,
    white: 0xffffff,
  }

  let target, action
  const handles = []
  const mouse = new Vector2(0, 0)
  const raycaster = new Raycaster()

  // Create geometry
  const geo = new OctahedronGeometry(0.5)
  const mat = new MeshBasicMaterial({ color: colors.gray2, wireframe: true })

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
      const handleGroup = new Group()
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

  export let flows = new InstancedFlow(curveGroups[0].length, curveGroups[0].length, geo, mat)

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
        const handleGroup = new Group()
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

        const line = new LineLoop(new BufferGeometry().setFromPoints(curve.getPoints(32)), mat)

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

  const sequencerGroup = new Group()

  selected$.subscribe(selected => {
    if (selected === -1) {
      offset.set(0)
    } else {
      offset.set(($selected$ - 1) * 20)
    }
  })

  scene.add(sequencerGroup)
  scene.add(flows.object3D)

  $: sequencerGroup.position.x = $offset
  $: selected = $selected$ === -1 ? 0 : $selected$ - 1

  const updateCurve = (j, curve) => {
    const newCurve = curve.clone()
    newCurve.points.map(point => (point.x += selected * 20))
    flows.updateCurve(j, newCurve)
  }

  $: curveGroups[selected].forEach(({ curve }, j) => {
    flows.setCurve(j, j % curveGroups[selected].length)
    updateCurve(j, curve)
  })

  /*
  control = new TransformControls(camera, renderer.domElement)
  control.showX = false
  control.showZ = false
  control.translationSnap = 1
  control.rotationSnap = false
  */

  const renderActive = target => {
    if (target) {
      target.scale.set(1.5, 1.5, 1.5)
    }
  }
  const renderInactive = target => {
    if (target) {
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

  /*
  $: if (action) {
    action = false
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(handles)
    if (intersects.length) {
      control.attach(target)
      scene.add(control)
    }
  }
  */

  const pulseMat = new MeshBasicMaterial({ color: colors.gray2 })

  rhythms$.pipe(delay(150)).subscribe(rhythms =>
    rhythms.forEach((rhythm, i) => {
      rhythm.forEach((pattern, j) => {
        // Compare amount of steps with scene
        // Update geometry if necessary
        if (pattern.length !== curveGroups[i][j].handleGroup.children.length) {
          // Create new points
          const points = regularPolygon(pattern.length, 8, rad(-90))
            .map(point => ({
              x: point[0] - i * 20,
              y: j * 8 + 2,
              z: point[1],
            }))
            .map(({ x, y, z }) => [x, y, z])

          const { curve, handleGroup, line } = curveGroups[i][j]

          const updateLine = () => {
            line.geometry.attributes.position.needsUpdate = true
            line.geometry.setDrawRange(0, points.length)

            const flatPoints = points.flat()
            for (let i = 0; i < flatPoints.length; i++)
              line.geometry.attributes.position.array[i] = flatPoints[i]
          }

          if (handleGroup.children.length < pattern.length) {
            // Handles
            const handle = new Mesh(geo, mat)
            handleGroup.add(handle)
            handleGroup.children.map((child, i) => child.position.set(...points[i]))

            //Line
            updateLine()

            // Curve & flow
            const vectorPoints = points.map(point => new Vector3(...point))
            curve.points = vectorPoints
            flows.setCurve(j, j % curveGroups[i].length)
            updateCurve(j, curve)
          }

          if (handleGroup.children.length > pattern.length) {
            // Handles
            handleGroup.remove(handleGroup.children[0])
            handleGroup.children.map((child, i) => child.position.set(...points[i]))

            // Line
            updateLine()

            // Curve & flow
            const vectorPoints = points.map(point => new Vector3(...point))
            curve.points = vectorPoints
            flows.setCurve(j, j % curveGroups[i].length)
            updateCurve(j, curve)
          }
        }

        // Update materials
        curveGroups[i][j].handleGroup.children.forEach((child, x) => {
          pattern[x] !== null ? (child.material = pulseMat) : (child.material = mat)
        })
      })
    }),
  )

  /*
   * Theme handling
   */

  theme.subscribe(mode => {
    const getFlowColor = () => (mode === 'light' ? colors.gray1 : colors.gray2)
    flows.object3D.material.color.setHex(getFlowColor(mode))
    mat.color.setHex(mode === 'light' ? colors.gray1 : colors.gray2)
    pulseMat.color.setHex(mode === 'light' ? colors.gray1 : colors.gray3)
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

  /*
  control.addEventListener('mouseDown', () => interacting.set(true))
  control.addEventListener('mouseUp', () => interacting.set(false))
  $: control.addEventListener('dragging-changed', ({ value }) => {
    if (!value) {
      FIXME: Increase speed with slope to prevent laggards
      curveGroups.forEach(g =>
        g.forEach(({ curve, line }) => {
          line.geometry.setFromPoints(curve.getPoints(50))
        }),
      )
      curveGroups[selected].forEach(({ curve }, j) => updateCurve(j, curve))
    }
  })
  */

  /*
  // Translation constraints
  control.addEventListener('change', () => {
    control.object.position.clamp(new Vector3(-100, 1, -100), new Vector3(100, 24, 100))
  })
  */
</script>
