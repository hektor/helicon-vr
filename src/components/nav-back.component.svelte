<script>
  import ArrowLeft32 from 'carbon-icons-svelte/lib/ArrowLeft32'

  export let href = '/#/'
</script>

<a class="back" {href}><ArrowLeft32 />Back</a>

<style>
  .back {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
</style>
