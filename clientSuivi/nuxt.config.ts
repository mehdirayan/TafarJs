// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
   ssr: true,
   modules: ['@nuxt/ui'],
   runtimeConfig: {
    public: {
      SERVER_URL: process.env.SERVER_URL,
      SERVER_PORT: process.env.SERVER_PORT
 
    },
  },
 
})
