<script>
  import { InstancedFlow } from 'three/examples/jsm/modifiers/CurveModifier'
  import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
  import {
    BoxGeometry,
    BufferGeometry,
    CatmullRomCurve3,
    Color,
    Mesh,
    MeshBasicMaterial,
    LineBasicMaterial,
    LineLoop,
    Raycaster,
    Vector2,
  } from 'three'
  import { getContext } from 'svelte'
  const { scene, renderer, camera } = getContext('scene')

  import { interacting } from '../stores/vr-controls'

  const colors = {
    white: 0xffffff,
    gray1: 0x333333,
    gray2: 0x555555,
  }

  const smallBoxDimensions = [0.5, 0.5, 0.5]
  const curvePositions = [
    [
      { x: 8, y: 2, z: -8 },
      { x: 8, y: 2, z: 8 },
      { x: -8, y: 2, z: 8 },
      { x: -8, y: 2, z: -8 },
    ],
    [
      { x: 8, y: 4, z: -8 },
      { x: 8, y: 4, z: 8 },
      { x: -8, y: 4, z: 8 },
      { x: -8, y: 4, z: -8 },
    ],
  ]

  export let flow
  let control, target, action, hover
  const curveHandles = []
  const mouse = new Vector2(0, 0)
  const raycaster = new Raycaster()

  // Create geometry
  const boxGeometry = new BoxGeometry(...smallBoxDimensions)
  const boxMaterial = new MeshBasicMaterial({ color: colors.gray2 })
  const boxActiveMaterial = new MeshBasicMaterial({ color: colors.white })

  const curves = curvePositions.map(curvePoints => {
    const curveVertices = curvePoints.map(position => {
      const handle = new Mesh(boxGeometry, boxMaterial)
      handle.position.copy(position)
      curveHandles.push(handle)
      scene.add(handle)
      return handle.position
    })

    const curve = new CatmullRomCurve3(curveVertices)
    curve.curveType = 'centripetal'
    curve.closed = true

    const line = new LineLoop(
      new BufferGeometry().setFromPoints(curve.getPoints(16)),
      new LineBasicMaterial({ color: colors.gray1 }),
    )

    scene.add(line)

    return { curve, line }
  })

  flow = new InstancedFlow(curves.length, curves.length, boxGeometry, boxMaterial)

  curves.forEach(({ curve }, i) => {
    flow.updateCurve(i, curve)
    scene.add(flow.object3D)
  })

  for (let i = 0; i < curves.length; i++) {
    flow.setCurve(i, i % curves.length)
    flow.moveIndividualAlongCurve(i, i)
    flow.object3D.setColorAt(i, new Color(colors.white))
  }

  control = new TransformControls(camera, renderer.domElement)
  control.showX = false
  control.showZ = false

  $: {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(curveHandles)
    if (intersects.length) {
      if (target !== intersects[0].object) {
        // Remove active material from current target
        target && (target.material = boxMaterial)
        // Set new target
        target = intersects[0].object
      }
    } else {
      target && (target.material = boxMaterial)
      target = null
    }
  }

  $: target && (target.material = boxActiveMaterial)

  $: if (action) {
    action = false
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(curveHandles)
    if (intersects.length) {
      control.attach(target)
      scene.add(control)
    }
  }

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
    !value &&
      curves.forEach(({ curve, line }, i) => {
        line.geometry.setFromPoints(curve.getPoints(50))
        flow.updateCurve(i, curve)
      })
  })
</script>
