import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { key } from '@/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'


// .use(store, key) The key is used to provide type information for the store's state.
createApp(App).use(store, key).use(router).mount('#app')