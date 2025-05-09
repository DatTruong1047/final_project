import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import { en } from './i18n'

const app = createApp(App)
export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'vn',
  globalInjection: true,
  messages: {
    en,
  },
})

app.use(createPinia())
app.use(router)

app.use(i18n)
app.mount('#app')
