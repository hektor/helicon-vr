<script>
  import { getContext } from 'svelte'
  const { scene } = getContext('scene')
  import { TorusKnotGeometry, MeshStandardMaterial, Mesh } from 'three'

  const geoKnot = new TorusKnotGeometry(8, 0.25, 128, 8)
  const matKnot = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 1 })
  const meshKnot = new Mesh(geoKnot, matKnot)
  meshKnot.name = 'meshKnot'
  meshKnot.position.set(0, 12, -8)
  scene.add(meshKnot)
</script>
