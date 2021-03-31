<script>
  import Header from '../components/header.component.svelte'
  import NavBack from '../components/nav-back.component.svelte'
</script>

<div class="container">
  <Header>
    <NavBack />
  </Header>
  <h1>About</h1>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
