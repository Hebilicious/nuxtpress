// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "../packages/nuxtpress/src/module.ts"
    // "@example/my-module"
  ],
  devtools: {
    enabled: true
  },
  experimental: {
    renderJsonPayloads: true
  }
})
