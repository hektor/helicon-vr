<script>
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import { getContext } from 'svelte'
  const { scene } = getContext('scene')

  const loader = new GLTFLoader().setPath('/')
  loader.load('terrain.glb', function (gltf) {
    gltf.scene.matrixAutoUpdate = false
    scene.add(gltf.scene)
  })
</script>
