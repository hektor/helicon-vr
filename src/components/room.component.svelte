<script>
  import { getContext } from 'svelte'
  const { scene } = getContext('scene')
  import { LineSegments, LineBasicMaterial } from 'three'
  import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry'

  const room = new LineSegments(
    new BoxLineGeometry(128, 128, 128, 16, 16, 16),
    new LineBasicMaterial({ color: 0x111111 }),
  )
  scene.add(room)
</script>
