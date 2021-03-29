<script>
  import * as THREE from 'three'
  import { getContext } from 'svelte'
  const { scene } = getContext('scene')

  const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000)
  const matStdFloor = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.2,
    metalness: 0,
  })

  const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor)
  scene.add(mshStdFloor)
</script>
