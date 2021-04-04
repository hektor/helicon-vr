<script>
  import Header from '../components/header.component.svelte'
  import NavBack from '../components/nav-back.component.svelte'
</script>

<svelte:head>
  <title>About Helicon</title>
</svelte:head>
<div class="container">
  <Header>
    <h1>About</h1>
    <NavBack />
  </Header>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
