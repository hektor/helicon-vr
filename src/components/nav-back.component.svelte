<script>
  import ArrowLeft32 from 'carbon-icons-svelte/lib/ArrowLeft32'

  export let href = '/#/'
</script>

<a class="back" {href}><ArrowLeft32 />Back</a>

<style>
  .back {
    margin-left: auto;
    padding: 0 3.2rem;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
</style>
