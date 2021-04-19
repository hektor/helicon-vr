<script>
  import LogoGithub32 from 'carbon-icons-svelte/lib/LogoGithub32'

  import Header from '../components/header.component.svelte'
  import Typewriter from '../components/typewriter.component.svelte'
  import Supports from '../components/browser-support.component.svelte'
</script>

<svelte:head>
  <title>Welcome</title>
</svelte:head>
<div class="container">
  <Header />
  <main>
    <div class="col col-left">
      <div class="title">
        <h1>Helicon 1.0</h1>
        <Typewriter text="An immersive introduction to polyrhythms." />
      </div>
      <div class="credits">
        <a class="repo" href="https://www.github.com/hektormisplon/bap"><LogoGithub32 /></a>
        <span
          >By &ensp;
          <a href="https://www.github.com/hektormisplon" target="_blank" rel="noopener"
            >Hektor Misplon</a
          >
        </span>
      </div>
    </div>
    <div class="col col-right">
      <div class="nav-group">
        <nav>
          <a href="/#/world">Discover</a>
        </nav>
        <nav>
          <a href="/#/about">About</a>
          <a href="/#/faq">FAQ</a>
        </nav>
      </div>
      <Supports />
    </div>
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
    display: flex;
    flex-wrap: wrap;
  }

  .col {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.6rem;
  }

  .col-left {
    color: var(--color-primary);
    background: var(--color-1);
    min-width: 32rem;
    max-width: 64rem;
  }

  .credits {
    border-top: 1px solid var(--color-3);
    padding: 1.6rem 1.6rem 0.8rem 0;
    margin: 0.8rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .credits > span {
    display: flex;
    align-items: center;
  }

  .repo {
    padding: 0.4rem 0.8rem;
  }

  .repo::after {
    content: '';
  }

  .title {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .nav-group {
    flex: 1;
  }
</style>
