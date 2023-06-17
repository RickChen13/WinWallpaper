import BaseViews from "@/fast/base/BaseView";
import { defineComponent, ref, nextTick } from "vue";
import LocalStorage from "@/common/LocalStorage";
import EventBus from "@/common/mitt/EventBus";

import { NDropdown, NImage } from "naive-ui";
class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "apps",
      setup() {
        const ContextMenu = [
          {
            label: "在文件夹中打开",
            key: 0,
          },
        ];
        const showDropdownRef = ref(false);
        const xRef = ref(0);
        const yRef = ref(0);
        const contextMenuIndex = ref(-1);
        return {
          ContextMenu,
          showDropdownRef,
          xRef,
          yRef,
          contextMenuIndex,
        };
      },
      data() {
        let appList: any = [];
        return {
          appList: appList,
          appsAppStyle: "",
        };
      },
      created() {},
      mounted() {
        this.getApps();
        this.setAppsAppStyle();

        window.onresize = () => {
          this.setAppsAppStyle();
        };
      },
      methods: {
        /**
         * 自适应
         */
        setAppsAppStyle() {
          let dom = document.getElementById("left");
          if (dom != null) {
            let appsWidth = dom.getBoundingClientRect().width - 15;
            if (document.body.getBoundingClientRect().width - 25 < appsWidth) {
              appsWidth -= 350;
            }
            let num = Math.floor(appsWidth / 170);
            let appWidth = appsWidth / num;
            this.appsAppStyle = `width:${appWidth}px;`;
          }
        },
        /**
         * 获取app列表
         */
        async getApps() {
          let apps = await window.MainApi.GetApps();
          this.appList = JSON.parse(apps);
          this.checkAutoPlay();
        },
        /**
         * 检查是否自动播放
         */
        checkAutoPlay() {
          let auto = false;
          let autoplay = LocalStorage.getLocalStorage("AutoPlay");

          if (autoplay != "") {
            auto = true;
            let lastOpen = LocalStorage.getLocalStorage("LastOpen");
            if (lastOpen != "") {
              for (let index = 0; index < this.appList.length; index++) {
                const element = this.appList[index];
                if (element.path == lastOpen) {
                  this.changeApp(element);
                  break;
                }
              }
            }
          }
          EventBus.emit("app-auto-play", auto);
        },
        /**
         * 改变app
         */
        changeApp(appInfo: any) {
          EventBus.emit("app-change", JSON.stringify(appInfo));
        },

        // #region 右键事件
        async showContextMenu($event: MouseEvent, index: number) {
          $event.preventDefault();
          this.contextMenuIndex = index;
          this.showDropdownRef = false;
          await nextTick();
          this.showDropdownRef = true;
          this.xRef = $event.clientX;
          this.yRef = $event.clientY;
        },

        async handleSelect(key: string | number) {
          switch (key) {
            case 0:
              await window.MainApi.OpenFolder(
                this.appList[this.contextMenuIndex].path
              );
              break;
          }
          this.showDropdownRef = false;
          this.contextMenuIndex = -1;
        },

        onClickoutside() {
          this.contextMenuIndex = -1;
          this.showDropdownRef = false;
        },
        //#endregion
      },
      components: {
        NDropdown,
        NImage,
      },
    });
    return vue;
  }
}

export default Component;
