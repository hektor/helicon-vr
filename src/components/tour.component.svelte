<script>
  import { onMount } from 'svelte'

  let shep
  onMount(async () => {
    const url = {
      js: 'https://cdnjs.cloudflare.com/ajax/libs/shepherd.js/8.3.0/js/shepherd.esm.js',
      css: 'https://cdnjs.cloudflare.com/ajax/libs/shepherd.js/8.0.0/css/shepherd.css',
    }
    shep = (await import(url.js)).default
    // const shepStylesFound = document.styleSheets[document.styleSheets.length - 1].href === url.css
    const shepStylesFound = true
    if (shep && shepStylesFound && !!!localStorage.getItem('receivedTourOffer')) init()
    localStorage.setItem('receivedTourOffer', true)
  })

  const init = () => {
    const tour = new shep.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        scrollTo: true,
      },
    })

    const steps = [
      {
        title: 'Quick tour',
        text: 'Would you like a quick tour of the application?',
        buttons: [
          {
            text: 'Start tour',
            action: tour.next,
          },
        ],
      },
      {
        title: 'Transport controls',
        text: `The tranport controls are located in the left side 
          of the top bar and allow you to control the playback.`,
        arrow: false,
        attachTo: {
          element: '.transport-controls',
          on: 'bottom',
        },
        buttons: [
          {
            text: 'Okay',
            action: tour.next,
          },
        ],
      },
      {
        title: 'BPM',
        text: `The global tempo is expressed in Beats Per Minute (BPM)
          and can be changed here.`,
        attachTo: {
          element: '#bpm',
          on: 'bottom',
        },
        buttons: [
          {
            text: 'Got it',
            action: tour.next,
          },
        ],
      },
      {
        title: 'Play/pause',
        text: `To play or pause the transport, this button can be used`,
        attachTo: {
          element: '#play',
          on: 'bottom',
        },
        buttons: [
          {
            text: 'Alright',
            action: tour.next,
          },
        ],
      },
      {
        title: 'Stop',
        text: `Stop the transport, the transport will restart at the beginning
          on the next playback`,
        attachTo: {
          element: '#stop',
          on: 'bottom',
        },
        buttons: [
          {
            text: 'Got it',
            action: tour.next,
          },
        ],
      },
      {
        title: 'Other feature',
        arrow: false,
        attachTo: {
          element: '#midi',
          on: 'bottom',
        },
        text: `Other features can be found on the right side of the top bar`,
        buttons: [
          {
            text: 'Check',
            action: tour.next,
          },
        ],
      },
      {
        title: 'MIDI devices',
        text: `Details about your connected MIDI devices can be found here,
          new MIDI devices can also be discovered here`,
        attachTo: {
          element: '#midi',
          on: 'bottom',
        },
        buttons: [
          {
            text: 'Okay',
            action: tour.next,
          },
        ],
      },
      {
        title: 'Theme',
        text: `Set your preferred theme (light or dark)`,
        attachTo: {
          element: '.theme-toggle',
          on: 'bottom',
        },
        buttons: [
          {
            text: 'Cool',
            action: tour.next,
          },
        ],
      },
      {
        title: 'Good luck!',
        text: `You finished the tour, have fun exploring.`,
        buttons: [
          {
            text: 'Complete',
            action: tour.next,
          },
        ],
      },
    ]

    tour.addSteps(steps)
    tour.start()
  }
</script>

<!--
<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/shepherd.js/8.0.0/css/shepherd.css"
    integrity="sha512-sc/EXnTEcinxW2Pq4YgmUhkkUwQi9SaEVWa7uFbuRNd+pVxZQFJemkfEcy7je31+rY3rgR3Tf0x3C2lmwlylYg=="
    crossorigin="anonymous"
  />
</svelte:head>
-->
<style>
  :global(.shepherd-modal-overlay-container) {
    height: 0;
    top: 0;
    left: 0;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    position: fixed;
    width: 100vw;
    z-index: 9997;
  }
  :global(.shepherd-modal-overlay-container.shepherd-modal-is-visible) {
    height: 100vh;
    opacity: 0.5;
  }
  :global(.shepherd-modal-overlay-container.shepherd-modal-is-visible path) {
    pointer-events: all;
  }
  :global(.shepherd-element) {
    border: 1px solid var(--color-2);
    background: var(--color-1);
    max-width: 64rem;
    opacity: 0;
    visibility: hidden;
    width: 100%;
    z-index: 9999;
  }
  :global(.shepherd-element:focus) {
    outline: 0.1rem dashed var(--color-5);
  }
  :global(.shepherd-enabled.shepherd-element) {
    opacity: 1;
    visibility: visible;
  }
  :global(.shepherd-element[data-popper-reference-hidden]:not(.shepherd-centered)) {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }
  :global(.shepherd-arrow),
  :global(.shepherd-arrow:before) {
    position: absolute;
    width: 16px;
    height: 16px;
    z-index: -1;
  }
  :global(.shepherd-arrow:before) {
    content: '';
    transform: rotate(45deg);
    background: var(--color-primary);
  }
  :global(.shepherd-element[data-popper-placement^='top'] > .shepherd-arrow) {
    bottom: -8px;
  }
  :global(.shepherd-element[data-popper-placement^='bottom'] > .shepherd-arrow) {
    top: -8px;
  }
  :global(.shepherd-element[data-popper-placement^='left'] > .shepherd-arrow) {
    right: -8px;
  }
  :global(.shepherd-element[data-popper-placement^='right'] > .shepherd-arrow) {
    left: -8px;
  }
  :global(.shepherd-element.shepherd-centered > .shepherd-arrow) {
    opacity: 0;
  }
  :global(.shepherd-element.shepherd-has-title[data-popper-placement^='bottom']
      > .shepherd-arrow:before) {
    background-color: var(--color-primary);
  }
  :global(.shepherd-target-click-disabled.shepherd-enabled.shepherd-target),
  :global(.shepherd-target-click-disabled.shepherd-enabled.shepherd-target *) {
    pointer-events: none;
  }
  :global(.shepherd-footer) {
    display: flex;
    justify-content: flex-end;
    padding: 1.6rem;
  }
  :global(.shepherd-text) {
    flex: 1;
    padding: 1.6rem;
    overflow: scroll;
  }
  :global(.shepherd-header) {
    display: flex;
  }
  :global(.shepherd-has-title .shepherd-content .shepherd-header) {
    background: var(--color-2);
    padding: 1.6rem;
  }

  :global(.shepherd-content) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  :global(.shepherd-button) {
    background: var(--color-primary);
    color: var(--color-bg);
    padding: 1.6rem;
  }
  :global(.shepherd-button.shepherd-button-secondary) {
    background: #f1f2f3;
    color: rgba(0, 0, 0, 0.75);
  }
  :global(.shepherd-button.shepherd-button-secondary:not(:disabled):hover) {
    background: #d6d9db;
  }
  :global(.shepherd-title) {
    display: flex;
    flex: 1 0 auto;
  }
  :global(.shepherd-cancel-icon:hover) {
  }
  :global(.shepherd-has-title .shepherd-content .shepherd-cancel-icon) {
  }
  :global(.shepherd-has-title .shepherd-content .shepherd-cancel-icon:hover) {
  }
</style>
