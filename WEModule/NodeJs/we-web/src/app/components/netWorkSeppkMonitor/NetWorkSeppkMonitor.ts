import BaseViews from "@/fast/base/BaseView";
import { defineComponent, inject } from "vue";
import EventBus from "@/fast/plugins/mitt/EventBus";
interface NetWorkSpeedData {
  /// <summary>
  /// 网络类型
  /// </summary>
  networkInterfaceType: string;

  /// <summary>
  /// 网络名称
  /// </summary>
  networkInterfaceName: string;

  /// <summary>
  /// 上行
  /// </summary>
  sed: number;

  /// <summary>
  /// 下行
  /// </summary>
  rec: number;
}

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "NetWorkSpeekMonitor",
      setup() {
        let params: any = inject("params");
        return {
          params,
        };
      },
      data() {
        return {
          myClass: "modules-div",
          style: "",
          networkInterfaceName: "",
          sed: "",
          rec: "",
        };
      },
      created() {},
      mounted() {
        EventBus.on("netWork", this.repeat);
        EventBus.on("ws-unsub", this.wsUnsub);
      },
      methods: {
        wsUnsub() {
          this.networkInterfaceName = ``;
          this.sed = ``;
          this.rec = ``;
        },
        /**
         * 设置样式
         */
        setStyle() {
          if (this.params.netWorkSpeekMonitor.multicolor) {
            this.myClass = "multicolor-text modules-div";
          } else {
            this.myClass = "modules-div";
          }
          this.style = this.getStyle(this.params.netWorkSpeekMonitor);
        },
        /**
         * 获取样式
         *
         * @returns
         */
        getStyle(array: any) {
          return `width: ${this.params.width}px;
                  line-height: ${this.params.height}px;
                  height: ${this.params.height}px;
                  font-size:${array.fontSize}px;
                  left: ${array.x - 50}%;
                  top: ${50 - array.y}%;`;
        },

        async start() {},
        async stop() {},

        async repeat(data: any) {
          this.RWallpaperNetWork(data);
        },
        RWallpaperNetWork(data: NetWorkSpeedData) {
          let [networkInterfaceName, sed, rec] = ["", "", ""];
          if (data.networkInterfaceType === "Loopback") {
            networkInterfaceName = "当前暂无网络连接";
            sed = "0/b";
            rec = "0/b";
          } else {
            networkInterfaceName = data.networkInterfaceName;
            if (data.sed < 1024) {
              sed = data.sed + " b/s";
            } else if (data.sed < 1048576) {
              sed = (data.sed / 1024).toFixed(1) + " k/s";
            } else {
              sed = (data.sed / 1048576).toFixed(1) + " m/s";
            }

            if (data.rec < 1024) {
              rec = data.rec + " b/s";
            } else if (data.rec < 1048576) {
              rec = (data.rec / 1024).toFixed(1) + " k/s";
            } else {
              rec = (data.rec / 1048576).toFixed(1) + " m/s";
            }
          }
          this.networkInterfaceName = `网络类型：${networkInterfaceName}`;
          this.sed = `上行：${sed}`;
          this.rec = `下行：${rec}`;
        },
      },
      components: {},
    });
    return vue;
  }
}

export default Component;
