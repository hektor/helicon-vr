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
      <div class="cta">
        <a class="pulse" href="/#/world">Discover</a>
        <a href="/#/about">Learn more</a>
        <a href="/#/faq">FAQ</a>
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
    /* flex grow hack*/
    flex-grow: 99999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.6rem;
  }

  .col-left {
    flex-grow: 1;
    flex-basis: 64rem;
    border-right: 1px solid var(--color-1);
    min-width: 48rem;
    min-height: 48rem;
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

  .pulse {
    background: var(--color-bg);
    color: var(--color-primary);
    box-shadow: 0 0 0 0 var(--color-primary);
    animation: pulse 1.75s infinite cubic-bezier(0.8, 0, 0, 1);
  }

  .cta {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: 6.4rem;
  }

  .cta > a {
    padding: 3.2rem;
    display: flex;
    min-width: 62%;
    align-items: center;
    font-size: 2.4rem;
    letter-spacing: -0.05rem;
    text-decoration: none;
    border: 1px solid transparent;
    transition: 0.16s cubic-bezier(0.8, 0.2, 0.2, 1);
  }

  .cta > a::after {
    content: '';
    position: relative;
    flex: 1;
    display: flex;
    margin: 1.6rem;
    border: 1px solid var(--color-2);
  }

  .cta > a:hover {
    background: var(--color-1);
    border: 1px solid var(--color-primary);
  }

  @keyframes pulse {
    to {
      box-shadow: 0 0 0 1.6rem var(--color-bg);
    }
  }
</style>
