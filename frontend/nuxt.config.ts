// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  router:{},

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