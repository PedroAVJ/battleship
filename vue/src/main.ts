import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { key } from './store';


// We pass key to the store so that TypeScript can annotate the store with the correct types
createApp(App).use(store, key).use(router).mount('#app')
