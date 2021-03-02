<script>
  import { onMount, onDestroy } from "svelte";
  // Try out snowpack 3.0 streaming imports
  import tweakpane from "https://cdn.skypack.dev/tweakpane";
  import { getContext } from "svelte";
  const { camera } = getContext("scene");
  import { settings } from "../stores/camera-settings.store";
  const { setFov, setNear, setFar, reset } = settings;

  /*
   * Update three.js camera props to settings state
   */
  const updateCamera = (setting) => {
    camera[setting] = $settings[setting];
    camera.updateProjectionMatrix();
  };

  // Make dispose obtainable on destroy
  let pane;

  /*
   * Initialize controls for camera settings
   */
  const initGui = () => {
    pane = new tweakpane({ title: "Camera settings" });
    pane
      .addInput($settings, "fov", { min: 15, max: 90, step: 1 })
      .on("change", ({ value }) => {
        setFov(value);
        updateCamera("fov");
      });
    pane
      .addInput($settings, "near", { min: 1, max: 1000, step: 1 })
      .on("change", ({ value }) => {
        setNear(value);
        updateCamera("near");
      });
    pane
      .addInput($settings, "far", { min: 1, max: 1000, step: 1 })
      .on("change", ({ value }) => {
        setFar(value);
        updateCamera("far");
      });
    pane.addButton({ title: "Default settings" }).on("click", (e) => {
      // Set camera settings to initial settings
      reset();
      updateCamera("fov");
      updateCamera("near");
      updateCamera("far");

      // Workaround for pane.refresh()
      pane.dispose();
      initGui();
    });
  };

  onMount(() => {
    initGui();
  });

  /* Remove controls */
  onDestroy(() => {
    pane.dispose();
  });
</script>
