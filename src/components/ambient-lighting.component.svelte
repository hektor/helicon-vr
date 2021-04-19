<script>
  import { AmbientLight } from 'three'
  import { theme } from '../stores/theme'
  import { getContext } from 'svelte'
  const { scene } = getContext('scene')

  const ambientLight = new AmbientLight(0xeeeeee, 1.25)
  scene.add(ambientLight)
  theme.subscribe(mode => {
    if (mode === 'dark') {
      scene.background.setHex(0x111111)
      ambientLight.color.setHex(0x111111)
      ambientLight.intensity = 0.125
    } else {
      scene.background.setHex(0xeeeeee)
      ambientLight.color.setHex(0xeeeeee)
      ambientLight.castShadow = true
      ambientLight.intensity = 1
    }
  })
</script>
