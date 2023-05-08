import App from '@/App.vue'
import router from '@/router'
import { createApp } from 'vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).mount('#app')