<script>
  import { onMount } from "svelte";
  import {
    Color,
    Fog,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BufferGeometry,
    LineBasicMaterial,
    MeshPhongMaterial,
    Line,
    Mesh,
    Plane,
    PlaneGeometry,
    Vector3,
    AmbientLight,
    DirectionalLight,
    SpotLight,
  } from "three";

  import Stats from "three/examples/jsm/libs/stats.module.js";
  import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
  import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

  let target;

  $: width = 0;
  $: height = 0;

  const settings = {
    fov: 45,
    near: 1,
    far: 500,
  };

  const { fov, near, far } = settings;

  /* Initialize GUI controls */
  const gui = new GUI();
  gui.add(settings, "fov", 0, 90).onChange((value) => {
    camera.fov = value;
    camera.updateProjectionMatrix();
  });
  gui.add(settings, "near", 0, 1000).onChange((value) => {
    camera.near = value;
    camera.updateProjectionMatrix();
  });
  gui.add(settings, "far", 0, 1000).onChange((value) => {
    camera.far = value;
    camera.updateProjectionMatrix();
  });

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, width / height, near, far / 2);
  const renderer = new WebGLRenderer();
  const material = new LineBasicMaterial({ color: 0x0000ff });
  const controls = new OrbitControls(camera, renderer.domElement);
  const stats = new Stats();

  /* Create rectangle*/
  const points = [];
  points.push(new Vector3(-8, 0, 0));
  points.push(new Vector3(8, 0, 0));
  points.push(new Vector3(8, 8, 0));
  points.push(new Vector3(-8, 8, 0));
  points.push(new Vector3(-8, 0, 0));
  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new Line(geometry, material);

  /* Create surface plane */
  const surface = new Mesh(new PlaneGeometry(16, 16, 16, 16));

  /* Add fog */
  scene.fog = new Fog(0xffffff, near, far);
  scene.background = new Color(0xcccccc);

  /* Lay surface flat */
  surface.rotation.x = -Math.PI / 2;

  /* Add geometry to scene */
  scene.add(surface);
  scene.add(line);

  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  controls.update();

  renderer.xr.enabled = true;

  $: target && target.appendChild(renderer.domElement);
  $: target && target.appendChild(VRButton.createButton(renderer));
  $: target && target.appendChild(stats.dom);

  const resize = () => {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  renderer.setAnimationLoop(() => {
    stats.begin();
    renderer.render(scene, camera);
    stats.end();
  });

  onMount(() => {
    resize();
  });
</script>

<svelte:window
  on:resize={resize}
  bind:innerWidth={width}
  bind:innerHeight={height} />
<div bind:this={target}>
  <slot />
</div>
