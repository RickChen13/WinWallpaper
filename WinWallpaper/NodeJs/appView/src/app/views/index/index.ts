import BaseViews from "@/fast/base/BaseView";
import { defineComponent, getCurrentInstance } from "vue";

import Apps from "@/app/components/apps/apps.vue";
import AppSetting from "@/app/components/appSetting/appSetting.vue";
import WebViewCallback from "@/app/components/webViewCallback/WebViewCallback.vue";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "index",
      setup() {
        const proxy = getCurrentInstance();
        return {
          proxy,
        };
      },
      created() {},
      methods: {},
      components: {
        Apps,
        AppSetting,
        WebViewCallback,
      },
    });
    return vue;
  }
}

export default Component;
