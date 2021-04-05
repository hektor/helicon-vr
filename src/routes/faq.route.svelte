<script>
  import Header from '../components/header.component.svelte'
  import NavBack from '../components/nav-back.component.svelte'
</script>

<svelte:head>
  <title>FAQ</title>
</svelte:head>
<div class="container">
  <Header>
    <h1>Frequently asked questions</h1>
    <NavBack />
  </Header>
  <div class="faq">
    <details>
      <summary>How can I connect my MIDI devices?</summary>
      <p>...</p>
    </details>
    <details>
      <summary>What is an Euclidean rhythm?</summary>
      <p>...</p>
    </details>
  </div>
</div>

<style>
  div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  p {
    padding: 3.2rem;
  }

  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .faq {
    flex: 1;
  }
</style>
