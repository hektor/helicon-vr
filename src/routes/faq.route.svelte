<script>
  import Header from '../components/header.component.svelte'
  import NavBack from '../components/nav-back.component.svelte'

  const data = [
    {
      title: 'MIDI',
      qa: [
        {
          question: 'How can I connect my MIDI devices?',
          answer:
            'Your MIDI devices should be automatically detected and available when connected.',
        },
        {
          question: 'Why are my MIDI devices not displaying?',
          answer:
            'It is likely that you have blocked MIDI access or your browser does not support MIDI. (You can allow MIDI access from your browser settings.)',
        },
      ],
    },
    {
      title: 'Sequencer',
      qa: [
        {
          question: 'What is an Euclidean rhythm?',
          answer:
            'Simply put, a rhythm consisting of a number of pulses spread as equidistant as possible over a number of positions',
        },
      ],
    },
    {
      title: 'Virtual reality',
      qa: [
        {
          question: 'Can I connect my Virtual Reality headset?',
          answer:
            'The application is currently only tested using the Oculus Browser on an Oculus Quest 2, but any WebXR capable device can be connected, if your setup is supported you should see an "Enter XR" button',
        },
        {
          question: "Can I use my Virtual Reality headset's controllers?",
          answer:
            'Currently we only guarantee Oculus Quest 2 controller support, feel free to report any issues you might have with different controllers',
        },
      ],
    },
  ]
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
    {#each data as { title, qa }}
      <h2>{title}</h2>
      {#each qa as { question, answer }}
        <details>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      {/each}
    {/each}
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

  h2 {
    padding: 1.6rem;
    margin-top: 3.2rem;
  }

  .faq {
    flex: 1;
    max-width: 64rem;
    margin: 6.4rem;
  }
</style>
