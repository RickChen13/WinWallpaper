import { createApp } from "vue";
import App from "@/app/App.vue";
import router from "@/app/router";
import "bootstrap-icons/font/bootstrap-icons.scss";

const setApi = async () => {
    window.DesktopJsApi = window.chrome.webview.hostObjects.DesktopJsApi
}
(async () => {
    await setApi();
    const app = createApp(App);
    app.use(router);
    app.mount("#app");
})()
