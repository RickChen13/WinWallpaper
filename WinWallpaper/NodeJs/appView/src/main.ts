import { createApp } from "vue";
import App from "./app/App.vue";
import router from "./app/router";
import store from "./app/store";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App);

import { Slider } from "vant";
app.use(Slider);
app.use(store);
app.use(router);
app.mount("#app");
