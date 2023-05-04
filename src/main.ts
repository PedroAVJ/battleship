import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// We use bundle because it includes popper.js, and that is required for tooltips to work
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


createApp(App).use(pinia).use(router).mount('#app')