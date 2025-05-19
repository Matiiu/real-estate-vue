import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './assets/main.css'
import 'vuetify/styles'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from '@/config/firebase'
import '@mdi/font/css/materialdesignicons.css'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const app = createApp(App)

// Vuetify
const vuetify = createVuetify({
	components,
	directives,
})

app.use(createPinia())
app.use(router)
// Vuetify
app.use(vuetify)
// Firebase
app.use(VueFire, {
	firebaseApp,
	modules: [VueFireAuth()],
})
// Alerts
app.use(VueSweetalert2)

app.mount('#app')
