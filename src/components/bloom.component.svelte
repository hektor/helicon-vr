<script>
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
  import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js'
  import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
  import { getContext } from 'svelte'
  import * as THREE from 'three'
  const { composer, scene, camera } = getContext('scene')

  const bloomParams = {
    bloomStrength: 2,
    bloomThreshold: 0.1,
    bloomRadius: 0.2,
  }

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85,
  )

  bloomPass.threshold = bloomParams.bloomThreshold
  bloomPass.strength = bloomParams.bloomStrength
  bloomPass.radius = bloomParams.bloomRadius

  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(bloomPass)
</script>
