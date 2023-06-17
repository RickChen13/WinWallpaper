import BaseViews from "@/fast/base/BaseView";
import { defineComponent, getCurrentInstance, inject } from "vue";
import EventBus from "@/fast/plugins/mitt/EventBus";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "Monitro",
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
        };
      },
      created() {},
      mounted() {
        EventBus.on("openHardware", this.repeat);
        EventBus.on("ws-unsub", this.wsUnsub);
      },
      methods: {
        init() {
          this.setStyle();
        },
        wsUnsub() {
          this.cpu = [];
          this.gpu = [];
          this.ram = [];
          this.hdd = [];
        },
        /**
         * 获取监控数据
         */
        async repeat(data: any) {
          if (this.params.monitro.show) {
            this.dealWithMsg(data);
          }
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
