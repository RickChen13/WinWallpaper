import BaseViews from "@/fast/base/BaseView";
import { defineComponent } from "vue";
import LocalStorage from "@/common/LocalStorage";
import EventBus from "@/common/mitt/EventBus";
class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      setup() {
        return {};
      },
      created() {
        window.MainCallBack.AutoOpenApp = this.AutoOpenApp;
        window.MainCallBack.SubWs = this.SubWs;
        EventBus.on("app-auto-play", this.AutoOpenAppCheck);
        this.SubWsCheck();
      },
      methods: {
        AutoOpenAppCheck(auto: boolean) {
          window.MainApi.AutoOpenApp(auto);
        },
        AutoOpenApp(auto: boolean) {
          if (auto) {
            LocalStorage.setLocalStorage("AutoPlay", "111");
          } else {
            LocalStorage.setLocalStorage("AutoPlay", "");
          }
        },
        SubWsCheck() {
          let SubWs = LocalStorage.getLocalStorage("SubWs");
          let sub = false;
          if (SubWs !== "") {
            sub = true;
          }
          window.MainApi.SubWs(sub);
        },
        SubWs(sub: boolean) {
          if (sub) {
            LocalStorage.setLocalStorage("SubWs", "111");
          } else {
            LocalStorage.setLocalStorage("SubWs", "");
          }
        },
      },
      components: {},
    });
    return vue;
  }
}

export default Component;
