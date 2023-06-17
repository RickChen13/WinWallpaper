import BaseViews from "@/fast/base/BaseView";
import { defineComponent, watch } from "vue";
import LocalStorage from "@/common/LocalStorage";
import EventBus from "@/common/mitt/EventBus";

import { NImage } from "naive-ui";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "appSetting",
      setup() {
        return {};
      },
      data() {
        let properties: any = [];

        let order: any = [];
        let keys: any = [];
        let settings: any = null;
        let config: any = {};

        return {
          properties,
          order,
          keys,
          settings,
          config,
          title: "",
          name: "",
          imgSrc: "",
          sliderInputDisabled: false,
        };
      },
      created() {},

      mounted() {
        EventBus.on("app-change", this.appChange);
      },
      methods: {
        async appChange(AppInfo: string) {
          let appInfo = JSON.parse(AppInfo);
          if (this.name != appInfo.path) {
            this.properties = this.order = this.keys = [];
            let openPath = `${appInfo.path}${appInfo.config.file}`;
            let openConfig = LocalStorage.getLocalStorage(openPath);
            if (openConfig == "") {
              LocalStorage.setLocalStorage(
                openPath,
                JSON.stringify(appInfo.config.general.properties)
              );
            } else {
              let MemoryConfig = JSON.parse(openConfig);
              this.keys = Object.keys(appInfo.config.general.properties);
              for (let i = 0; i < this.keys.length; i++) {
                const element = this.keys[i];
                let MemoryConfigElement = MemoryConfig[element];
                if (MemoryConfigElement != undefined) {
                  appInfo.config.general.properties[element].value =
                    MemoryConfigElement.value;
                }
              }
            }

            this.config = appInfo;
            this.name = appInfo.path;
            this.settings = appInfo.config;

            this.title = this.settings.title;
            this.imgSrc = `${this.name}\\${this.settings.preview}`;
            this.loadConfig();

            LocalStorage.setLocalStorage("LastOpen", appInfo.path);
            window.MainApi.OpenApp(
              openPath,
              JSON.stringify(appInfo.config.general.properties)
            );
          }
        },

        //#region config转换
        loadConfig() {
          if (this.settings != null) {
            this.properties = [];
            const settings: any = this.settings.general.properties;
            this.keys = Object.keys(settings);
            for (let index = 0; index < this.keys.length; index++) {
              const element = this.keys[index];
              this.order.push(settings[element].index);
            }
            this.order = this.quickSort(this.order);
            this.properties = this.onderSettings(settings);
          }
        },
        /**
         * 对settings进行排序
         * @param settings
         * @returns
         */
        onderSettings(settings: any) {
          let result: any = new Array();
          let defineStr = "";
          for (let index = 0; index < this.keys.length; index++) {
            const element = this.keys[index];

            let resIndex = this.getKey4Value(
              this.order,
              settings[element].index
            );
            if (resIndex != null) {
              let set = settings[element];
              if (typeof set.setTingsId == "undefined") {
                set.setTingsId = resIndex;
              }
              defineStr += `let ${element} = ${JSON.stringify(set)};`;
              result[resIndex] = set;
            }
          }

          for (let index = 0; index < result.length; index++) {
            let element = result[index];

            if (
              typeof element.condition != "undefined" &&
              typeof element.condition != "boolean"
            ) {
              let condition = false;

              try {
                condition = eval(`(()=>{
                    ${defineStr};
                    return ${element.condition};
                  })();
                  `);
              } catch (error) {
                console.info(error);
              }
              result[index].show = condition;

              if (typeof this.properties[index] != "undefined") {
                result[index].setTingsId =
                  this.properties[index].setTingsId + this.keys.length;
              }
            } else {
              result[index].show = true;
            }
          }
          return result;
        },
        select(value: any, val: any) {
          if (val != value.value) {
            let index = this.getKey4ValueAndName(
              this.properties,
              value.index,
              "index"
            );
            if (index != null) {
              this.changePropertiesValue(index, val);
            }
          }
        },
        changePropertiesValue(index: number, value: any) {
          this.properties[index].value = value;
          const settings = this.settings.general.properties;
          for (let i = 0; i < this.keys.length; i++) {
            const element = this.keys[i];
            let resIndex = this.getKey4Value(
              this.order,
              settings[element].index
            );
            if (resIndex == index) {
              this.settings.general.properties[element].value = value;
              if (this.name != "") {
                this.config.config.general.properties[element].value = value;
                let changeConfig = eval(`(()=>{
                    return {${element}:this.config.config.general.properties[element]};
                  })();`);
                window.MainApi.AppConfigChange(JSON.stringify(changeConfig));

                LocalStorage.setLocalStorage(
                  `${this.name}${this.settings.file}`,
                  JSON.stringify(this.settings.general.properties)
                );
              }
              if (this.settings.general.properties[element].type != "slider") {
                this.properties = this.onderSettings(
                  this.settings.general.properties
                );
              }

              break;
            }
          }
        },
        getKey4ValueAndName(arr: any[], value: any, name: any) {
          for (let index = 0; index < arr.length; index++) {
            if (arr[index][name] == value) {
              return index;
            }
          }
          return null;
        },
        /**
         * 根据值获取key
         *
         * @param arr 数组
         * @param value
         * @returns
         */
        getKey4Value(arr: any[], value: any) {
          for (let index = 0; index < arr.length; index++) {
            if (arr[index] == value) {
              return index;
            }
          }
          return null;
        },
        /**
         * 快排
         * @param arr 数组
         * @returns
         */
        quickSort(arr: any[]): any {
          if (arr.length <= 1) {
            return arr;
          }
          let pivotIndex = Math.floor(arr.length / 2);
          let pivot = arr.splice(pivotIndex, 1)[0];
          let left = [];
          let right = [];
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] < pivot) {
              left.push(arr[i]);
            } else {
              right.push(arr[i]);
            }
          }
          return this.quickSort(left).concat([pivot], this.quickSort(right));
        },

        //#endregion

        //#region 设置改变事件

        checkbookInput($event: { target: HTMLInputElement }, value: any) {
          let val = $event.target.checked;
          let index = this.getKey4ValueAndName(
            this.properties,
            value.index,
            "index"
          );
          if (index != null) {
            this.changePropertiesValue(index, val);
          }
        },

        sliderInput(
          $event: { target: HTMLInputElement },
          value: any,
          disabled = false
        ) {
          this.sliderInputDisabled = disabled;
          let val = Number($event.target.value);
          $event.target.disabled = disabled;
          let getVal = (value: any, defaultVal: any) => {
            let result = defaultVal;
            switch (true) {
              case value.value == value.min:
                result = value.max;
                break;
              case value.value == value.max:
                result = value.min;
                break;
            }
            return result;
          };
          switch (true) {
            case isNaN(val):
              val = getVal(value, val);
              break;
            case Number(val) > Number(value.max):
              val = getVal(value, value.max);
              break;
            case Number(val) < Number(value.min):
              val = getVal(value, value.min);
              break;
          }
          if (val != value.value) {
            let index = this.getKey4ValueAndName(
              this.properties,
              value.index,
              "index"
            );
            if (index != null) {
              this.changePropertiesValue(index, val);
            }
          }
        },

        textInput($event: { target: HTMLInputElement }, value: any) {
          let val = $event.target.value;
          if (val != value.value) {
            let index = this.getKey4ValueAndName(
              this.properties,
              value.index,
              "index"
            );
            if (index != null) {
              this.changePropertiesValue(index, val);
            }
          }
        },

        colorInput($event: { target: HTMLInputElement }, value: any) {
          let val = $event.target.value;
          if (val != value.value) {
            let index = this.getKey4ValueAndName(
              this.properties,
              value.index,
              "index"
            );
            if (index != null) {
              this.changePropertiesValue(index, val);
            }
          }
        },

        //#endregion
      },
      components: {
        NImage,
      },
    });
    return vue;
  }
}

export default Component;
