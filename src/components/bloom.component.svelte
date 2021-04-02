<script>
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
  import { getContext } from 'svelte'
  import * as THREE from 'three'
  const { composer } = getContext('scene')

  const bloomParams = {
    bloomStrength: 1,
    bloomThreshold: 0,
    bloomRadius: 0,
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

  composer.addPass(bloomPass)
</script>
