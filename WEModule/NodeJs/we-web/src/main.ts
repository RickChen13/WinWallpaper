import { createApp } from 'vue';
import App from '@/app/App.vue';
const app = createApp(App);

import router from '@/app/router';
app.use(router);

import { createPinia } from 'pinia';
app.use(createPinia());

import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'element-plus/dist/index.css';
app.use(ElementPlus, {
    locale: zhCn
});

app.mount('#app');

