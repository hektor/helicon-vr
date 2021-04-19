<script>
  import { getContext } from 'svelte'
  import { LineSegments, LineBasicMaterial } from 'three'
  import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry'

  const { scene } = getContext('scene')
  import { theme } from '../stores/theme'

  const setColor = color => room.material.color.setHex(color)

  const room = new LineSegments(
    new BoxLineGeometry(128, 128, 128, 16, 16, 16),
    new LineBasicMaterial(),
  )

  scene.add(room)

  theme.subscribe(theme => (theme === 'light' ? setColor(0xaaaaaa) : setColor(0x111111)))
</script>
