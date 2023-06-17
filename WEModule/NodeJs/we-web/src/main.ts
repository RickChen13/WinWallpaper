import { createApp } from "vue";
import App from "./app/App.vue";
import router from "./app/router";
import store from "./app/store";

import "bootstrap-icons/font/bootstrap-icons.scss";

const app = createApp(App);
app.use(store);
app.use(router);

app.mount("#app");
