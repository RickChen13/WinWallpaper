import BaseViews from "@/fast/base/BaseView";
import EventBus from "@/fast/mitt/EventBus";
import { defineComponent, inject } from "vue";

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
      name: "netWorkSpeekMonitor",
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
          timeIndex: 0,
        };
      },
      created() {
        window.WallpaperNetWorkSpeed = this.RWallpaperNetWork;
      },
      methods: {
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
        RWallpaperNetWork(data: NetWorkSpeedData) {
          if (data.networkInterfaceType === "Loopback") {
            this.networkInterfaceName = "当前暂无网络连接";
            this.sed = "0/b";
            this.rec = "0/b";
          } else {
            this.networkInterfaceName = data.networkInterfaceName;
            if (data.sed < 1024) {
              this.sed = data.sed + " b/s";
            } else if (data.sed < 1048576) {
              this.sed = (data.sed / 1024).toFixed(1) + " k/s";
            } else {
              this.sed = (data.sed / 1048576).toFixed(1) + " m/s";
            }

            if (data.rec < 1024) {
              this.rec = data.rec + " b/s";
            } else if (data.rec < 1048576) {
              this.rec = (data.rec / 1024).toFixed(1) + " k/s";
            } else {
              this.rec = (data.rec / 1048576).toFixed(1) + " m/s";
            }
          }
          this.setEvent();
        },

        setEvent() {
          if (this.timeIndex <= 0) {
            let str = `<span style="font-size:20px">网络类型：${this.networkInterfaceName}&nbsp;&nbsp; 上行：${this.sed}&nbsp;&nbsp; 下行：${this.rec}</span>`;
            EventBus.emit("danmaku", str);
            this.timeIndex = 5;
          }
          this.timeIndex--;
        },
      },
      components: {},
    });
    return vue;
  }
}

export default Component;
