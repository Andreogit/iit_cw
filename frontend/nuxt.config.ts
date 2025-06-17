// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  router:{},

  runtimeConfig: {
    public: {
      baseURL: process.env.baseURL ?? process.env.NUXT_PUBLIC_baseURL ?? 'http://localhost:5000'
    }
  },

  image: {
    dir: 'assets/images'
  },

  components: {
    global: true,
    dirs: ['~/components'],
  },

  css: ['@/assets/css/main.css','@/assets/css/variables.css'],
  modules: ['@nuxt/image'],
})