/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/dist',
  },
  plugins: ['@snowpack/plugin-svelte'],
  routes: [{ match: 'routes', src: '.*', dest: '/index.html' }],
  optimize: {},
  devOptions: {},
  buildOptions: {},
  packageOptions: {
    source: 'remote',
  },
}
