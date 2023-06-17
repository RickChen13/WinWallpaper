import { createApp } from "vue";
import App from "@/app/App.vue";
import router from "@/app/router";
// import store from "@/app/store";
// import ElementPlus from "element-plus";
// import zhCn from "element-plus/es/locale/lang/zh-cn";
// import "element-plus/dist/index.css";
import "bootstrap-icons/font/bootstrap-icons.scss";

const app = createApp(App);

// app.use(store);
app.use(router);
// app.use(ElementPlus, {
//   locale: zhCn,
// });

app.mount("#app");
