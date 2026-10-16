import './assets/main.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueform/multiselect/themes/default.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import SkeletonLoader from './components/skeleton/SkeletonLoader.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Registered globally so any screen can show a skeleton placeholder while its
// async data loads, without importing the component everywhere.
app.component('SkeletonLoader', SkeletonLoader)

app.mount('#app')
