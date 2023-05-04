import App from '@/App.vue'
import router from '@/router'
import { createApp } from 'vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'bootstrap/dist/css/bootstrap.min.css'

// We use bundle because it includes popper.js, and that is required for tooltips to work
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


// Create pinia instance that uses the persistedstate plugin
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).mount('#app')