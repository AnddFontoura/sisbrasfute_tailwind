import './assets/main.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueform/multiselect/themes/default.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
