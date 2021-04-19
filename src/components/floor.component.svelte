<script>
  import { Mesh, BoxGeometry, MeshStandardMaterial } from 'three'
  import { getContext } from 'svelte'
  const { scene } = getContext('scene')

  scene.add(
    new Mesh(
      new BoxGeometry(2000, 0.1, 2000),
      new MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.2,
        metalness: 0,
      }),
    ),
  )
</script>
