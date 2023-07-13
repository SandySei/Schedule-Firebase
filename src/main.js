// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import "../firebase.config";
import router from "./router";

import "@/modules/auth";
import 'animate.css';

const app = createApp(App)

app.use(router);

registerPlugins(app)

app.mount('#app')
