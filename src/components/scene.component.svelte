<script>
  import { onMount, setContext } from "svelte";
  import {
    Clock,
    Color,
    Fog,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BufferGeometry,
    LineBasicMaterial,
    MeshBasicMaterial,
    Line,
    Mesh,
    Vector3,
    PointLight,
    SphereGeometry,
  } from "three";

  import Stats from "three/examples/jsm/libs/stats.module.js";
  import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

  import { settings } from "../stores/camera-settings.store";

  import GUI from "./gui.component.svelte";
  import Terrain from "./terrain.component.svelte";

  let target;

  $: width = 0;
  $: height = 0;

  const { fov, near, far } = $settings;

  const clock = new Clock();

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

  /* Add fog */
  scene.fog = new Fog(0x111111, near, far);
  scene.background = new Color(0x0c0c0c);

  const sphere = new SphereGeometry(0.25, 16, 16);

  sphere.translate(0, 8, 0);

  const light = new PointLight(0xffffff, 1, 16);
  light.add(new Mesh(sphere, new MeshBasicMaterial({ color: 0xffffff })));
  scene.add(light);

  /* Add geometry to scene */
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

    const time = clock.getElapsedTime();

    light.position.x = Math.sin(time * 8) * 8;
    light.position.z = Math.cos(time * 8) * 8;
    stats.end();
  });

  onMount(() => {
    resize();
  });

  export const ctx = {
    scene,
    camera,
  };

  setContext("scene", ctx);
</script>

<svelte:window
  on:resize={resize}
  bind:innerWidth={width}
  bind:innerHeight={height} />
<div bind:this={target}>
  <GUI />
  <Terrain />
</div>
