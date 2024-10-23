import BaseViews from "@/fast/base/BaseView";
import { defineComponent, getCurrentInstance, inject } from "vue";

import WeatherController from "@/app/api/controller/WeatherController";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      setup() {
        const proxy = getCurrentInstance();
        const weatherApi = new WeatherController();
        let params: any = inject("params");
        return {
          proxy,
          weatherApi,
          params,
        };
      },
      data() {
        return {
          myClass: "modules-div",
          //天气信息
          weather: "",
          //天气样式
          weatherStyle: "",
          weatherRefresh: 0,
        };
      },
      created() {
        this.setStyle();
      },
      methods: {
        init() {
          if (this.params.weather.show) {
            this.weather = "天气";
            this.weatherRefresh = this.params.weather.refresh;
            this.setWeather();
          } else {
            this.weather = "";
          }
        },
        /**
         * 刷新
         */
        repeat() {
          if (this.params.weather.show) {
            if (this.weatherRefresh == 0) {
              this.getWeather();
              this.weatherRefresh = this.params.weather.refresh;
            }
            this.weatherRefresh -= 1;
          }
        },
        /**
         * 设置样式
         */
        setStyle() {
          if (this.params.weather.multicolor) {
            this.myClass = "multicolor-text modules-div";
          } else {
            this.myClass = "modules-div";
          }
          this.weatherStyle = this.getStyle(this.params.weather);
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
        setWeather() {
          if (this.params.weather.show) {
            this.weather = "天气";
            this.weatherRefresh = this.params.weather.refresh;
            this.getWeather();
          } else {
            this.weather = "";
          }
        },

        /**
         * 获取天气
         */
        async getWeather() {
          let res: any = await this.weatherApi.getWeather({
            data: {
              city: this.params.weather.city,
            },
          });
          if (res.result) {
            let data = res.data;
            this.weather = `${data.city} ${data.weather} ${data.temp}℃ ${data.wind}`;
          }
        },
      },
      components: {},
    });
    return vue;
  }
}

export default Component;
