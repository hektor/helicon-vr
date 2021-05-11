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
  <main>
    <h2>An immersive introduction to polyrhythm-based music production.</h2>
    <p>
      The source code for Helicon is available on
      <a class="repo" href="https://www.github.com/hektormisplon/bap">GitHub</a>
    </p>
    <p>
      Please check the <a href="/#/contact">FAQ</a> for any questions you might have, or
      <a href="mailto:hektor.misplon@gmail.com?subject=Helicon">contact me</a>
      if you cannot find what you are looking for.
    </p>
    <p>
      Learn more about the <a href="/#/requirements">browser requirements</a> for using Helicon?
    </p>
  </main>
</div>

<style>
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    max-width: 64rem;
    margin: 6.4rem;
  }

  h2 {
    padding: 1.6rem;
    margin-top: 3.2rem;
  }

  p {
    padding: 1.6rem;
  }
</style>
