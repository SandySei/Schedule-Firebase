// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import "../firebase.config";
import router from "./router";

import "@/modules/auth";

import "@/modules/customer";
const app = createApp(App)

app.use(router);

registerPlugins(app)
app.use(VCalendar, {})

app.mount('#app')
