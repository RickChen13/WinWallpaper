import BaseViews from "@/fast/base/BaseView";
import EventBus from "@/fast/mitt/EventBus";
import { defineComponent, getCurrentInstance, inject } from "vue";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "monitro",
      setup() {
        const proxy = getCurrentInstance();
        let params: any = inject("params");
        return {
          proxy,
          params,
        };
      },
      data() {
        let cpu: CpuInfo[] = [];
        let gpu: DataInfo[] = [];
        let ram: DataInfo[] = [];
        let hdd: DataInfo[] = [];
        return {
          myClass: "modules-div",
          style: "",
          cpu: cpu,
          cpuStyle: "",
          gpu: gpu,
          gpuStyle: "",
          ram: ram,
          ramStyle: "",
          hdd: hdd,
          hddStyle: "",
          timeIndex: 0,
        };
      },
      created() {},
      mounted() {
        window.WallpaperOpenHardware = (data: Data) => {
          if (this.params.monitro.show) {
            this.dealWithMsg(data);
          }
        };
      },
      methods: {
        init() {
          this.setStyle();
        },
        /**
         * 处理monitorData信息
         *
         * @param monitorData
         */
        dealWithMsg(monitorData: Data) {
          let cpuInfo: CpuInfo[] = [];
          let cpu_info: CpuInfo = {
            Name: "",
            Use: 0,
            Temperature: 0,
            Power: 0,
          };

          if (this.params.monitro.cpu.show) {
            for (let index = 0; index < monitorData.CpuUsed.length; index++) {
              cpuInfo[index] = cpu_info;
              let element = monitorData.CpuUsed[index];
              cpuInfo[index].Name = element.Name;
              cpuInfo[index].Use = Number(element.Value);
            }
          } else {
            cpuInfo = [];
          }

          if (this.params.monitro.gpu.show) {
            for (
              let index = 0;
              index < monitorData.CpuTemperature.length;
              index++
            ) {
              const element = monitorData.CpuTemperature[index];
              let key = this.findKey4ChildKeyValue(
                cpuInfo,
                "name",
                element.Name
              );
              cpuInfo[key].Name = element.Name;
              cpuInfo[key].Temperature = Number(element.Value);
            }
          } else {
            cpuInfo = [];
          }

          if (this.params.monitro.gpu.show) {
            for (let index = 0; index < monitorData.CpuPower.length; index++) {
              const element = monitorData.CpuPower[index];
              let key = this.findKey4ChildKeyValue(
                cpuInfo,
                "name",
                element.Name
              );
              cpuInfo[key].Name = element.Name;
              cpuInfo[key].Power = Number(element.Value);
            }
          } else {
            cpuInfo = [];
          }

          this.cpu = cpuInfo;
          this.ram = monitorData.MemoryUsed;
          this.gpu = monitorData.GpuUsed;
          if (this.params.monitro.hdd.show) {
            this.hdd = monitorData.HddUsed;
          } else {
            this.hdd = [];
          }
          this.setEvent();
        },
        setEvent() {
          switch (true) {
            case this.timeIndex <= 0:
              for (let index = 0; index < this.cpu.length; index++) {
                const element = this.cpu[index];
                let str = `<span style=" font-size: 20px">CPU 使用率：${Math.round(
                  Number(element.Use)
                )}%  温度：${Math.round(
                  Number(element.Temperature)
                )}℃  功率：${Math.round(Number(element.Power))}W</span>`;
                EventBus.emit("danmaku", str);
              }
              this.timeIndex = 5;
              break;
            case this.timeIndex == 1:
              for (let index = 0; index < this.cpu.length; index++) {
                const element = this.cpu[index];
                let str = `<span style=" font-size: 20px">CPU 使用率：${Math.round(
                  Number(element.Use)
                )}%  </span>`;
                EventBus.emit("danmaku", str);
              }
              break;
            case this.timeIndex == 2:
              for (let index = 0; index < this.cpu.length; index++) {
                const element = this.cpu[index];
                let str = `<span style=" font-size: 20px">CPU 温度：${Math.round(
                  Number(element.Temperature)
                )}℃</span>`;
                EventBus.emit("danmaku", str);
              }
              break;
            case this.timeIndex == 3:
              for (let index = 0; index < this.cpu.length; index++) {
                const element = this.cpu[index];
                let str = `<span style=" font-size: 20px">CPU  功率：${Math.round(
                  Number(element.Power)
                )}W</span>`;
                EventBus.emit("danmaku", str);
              }
              break;
            case this.timeIndex == 4:
              for (let index = 0; index < this.gpu.length; index++) {
                const element = this.gpu[index];
                let str = `<span style=" font-size: 20px">GPU 使用率：${Math.round(
                  Number(element.Value)
                )}% </span>`;
                EventBus.emit("danmaku", str);
              }
              break;
            default:
              break;
          }
          this.timeIndex--;
        },
        /**
         * 设置样式
         */
        setStyle() {
          if (this.params.monitro.multicolor) {
            this.myClass = "multicolor-text modules-div";
          } else {
            this.myClass = "modules-div";
          }
          this.style = this.getStyle({
            width: this.params.width,
            height: this.params.height,
            fontSize: this.params.monitro.fontSize,
            x: this.params.monitro.x,
            y: this.params.monitro.y,
          });
        },
        /**
         * 获取样式
         */
        getStyle(data: StyleData) {
          return `width: ${data.width}px;
              line-height: ${data.height}px;
              height: ${data.height}px;
              font-size:${data.fontSize}px;
              left: ${data.x - 50}%;
              top: ${50 - data.y}%;
              `;
        },
        /**
         * 根据子键值对寻找索引
         *
         * @param array
         * @param childKey
         * @param childValue
         * @returns
         */
        findKey4ChildKeyValue(
          array: any,
          childKey: string,
          childValue: string
        ) {
          let key = 0;
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element[childKey] == childValue) {
              key = index;
              break;
            }
          }
          return key;
        },
      },
      components: {},
    });
    return vue;
  }
}

interface DataInfo {
  Name: string;
  Value: string;
}

interface Data {
  CpuUsed: DataInfo[];
  CpuPower: DataInfo[];
  CpuTemperature: DataInfo[];
  GpuUsed: DataInfo[];
  MemoryUsed: DataInfo[];
  HddUsed: DataInfo[];
}

interface CpuInfo {
  Name: string;
  Use: Number;
  Temperature: Number;
  Power: Number;
}

interface StyleData {
  width: number;
  height: number;
  fontSize: number;
  x: number;
  y: number;
}
export default Component;
