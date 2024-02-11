import 'bootstrap/dist/css/bootstrap.css'
import 'highlight.js/styles/stackoverflow-dark.css'
import hljs from 'highlight.js/lib/core';
import lua from 'highlight.js/lib/languages/lua';
import hljsVuePlugin from "@highlightjs/vue-plugin";

import { createApp } from 'vue'
import App from './App.vue'

hljs.registerLanguage('lua', lua);

const app = createApp(App);
app.use(hljsVuePlugin);
app.mount('#app');
