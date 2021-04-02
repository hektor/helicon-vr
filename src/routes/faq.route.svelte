<script>
  import Header from '../components/header.component.svelte'
</script>

<div class="container">
  <Header />
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

  summary {
    padding: 3.2rem;
    border-bottom: 1px solid var(--color-2);
  }

  details[open] summary ~ * {
    animation: sweep 0.5s ease-in-out;
  }

  @keyframes sweep {
    0% {
      opacity: 0;
      margin-left: -10px;
    }
    100% {
      opacity: 1;
      margin-left: 0px;
    }
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
