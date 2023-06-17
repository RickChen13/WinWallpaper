import BaseViews from "@/fast/base/BaseView";
import { defineComponent, inject, nextTick } from "vue";

type List = [BackgroundConfigDevice, BackgroundConfigDevice];
class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "Background",
      setup() {
        let params: any = inject("params");
        return {
          params,
        };
      },
      data() {
        let imgArr = window.backgroundConfig.pc;
        let list: List = [
          {
            path: "",
            class: "",
          },
          {
            path: "",
            class: "",
          },
        ];

        return {
          isInit: true,
          imgArr,
          show: {
            list,
            checked: 0,
          },
          refresh: false,
          refreshTime: 5,
          lastActive: 55,
        };
      },
      created() {},
      methods: {
        /**
         * 加载完成dom后执行的函数(供外部使用)
         */
        async init() {
          this.isInit = true;
          if (this.params.isMobile) {
            this.imgArr = window.backgroundConfig.mobile;
          } else {
            this.imgArr = window.backgroundConfig.pc;
          }
          this.show.list = [
            {
              path: "",
              class: "",
            },
            {
              path: "",
              class: "",
            },
          ];
          this.show.checked = 0;
          this.lastActive = this.params.background.lastActive;
          if (this.params.background.lastActive > this.imgArr.length) {
            this.params.background.lastActive = this.imgArr.length - 1;
          }
          if (this.params.background.isRefresh) {
            let num = this.imgArr.length;
            let activated = this.randomNum(0, num - 1);
            this.lastActive = this.params.background.lastActive = activated;
          }
          await nextTick();
          this.isInit = false;

          this.showListPathChange();
        },
        /**
         * 刷新(供外部使用)
         */
        repeat() {
          if (this.params.background.isRefresh) {
            this.refreshTime--;
            if (this.refreshTime <= 0) {
              this.refresh = true;
              this.refreshTime = this.params.background.refreshTime;
            }
          }
          this.changeBackground();
        },
        /**
         * 获取随机数
         *
         * @param {number} minNum
         * @param {number} maxNum
         * @returns
         */
        randomNum(minNum: number, maxNum: number) {
          switch (arguments.length) {
            case 1:
              return parseInt(String(Math.random() * minNum + 1), 10);
            case 2:
              return parseInt(
                String(Math.random() * (maxNum - minNum + 1) + minNum),
                10
              );
            default:
              return 0;
          }
        },
        load(bool: boolean) {
          if (!bool) {
            this.showListcClassChange();
          }
        },
        /**
         * 更换背景图片
         */
        changeBackground() {
          if (this.params.background.isRefresh && this.refresh) {
            let num = this.imgArr.length;
            let activated = this.randomNum(0, num - 1);
            this.lastActive = this.params.background.lastActive = activated;
            this.refresh = false;
            this.showListPathChange();
          } else if (
            !this.params.background.isRefresh &&
            this.lastActive != this.params.background.lastActive
          ) {
            if (this.params.background.lastActive > this.imgArr.length) {
              this.params.background.lastActive = this.imgArr.length - 1;
            }
            this.lastActive = this.params.background.lastActive;
            this.showListPathChange();
          }
        },
        showListPathChange() {
          switch (this.show.checked) {
            case 0:
              if (
                this.show.list[1].path ==
                this.imgArr[this.params.background.lastActive].path
              ) {
                this.showListcClassChange();
              } else {
                this.show.list[1].path =
                  this.imgArr[this.params.background.lastActive].path;
              }

              break;
            case 1:
              if (
                this.show.list[0].path ==
                this.imgArr[this.params.background.lastActive].path
              ) {
                this.showListcClassChange();
              } else {
                this.show.list[0].path =
                  this.imgArr[this.params.background.lastActive].path;
              }

              break;
          }
        },
        showListcClassChange() {
          switch (this.show.checked) {
            case 0:
              this.show.list[0].class = "";
              this.show.list[1].class = "active";
              this.show.checked = 1;
              break;
            case 1:
              this.show.list[1].class = "";
              this.show.list[0].class = "active";
              this.show.checked = 0;
              break;
          }
        },
      },
      components: {},
    });
    return vue;
  }
}

export default Component;
