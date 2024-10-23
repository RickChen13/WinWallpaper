import BaseViews from "@/fast/base/BaseView";
import { defineComponent, getCurrentInstance, inject } from "vue";

import DoublePY from "@/app/components/doublePY/type";
class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      setup() {
        let params: any = inject("params");
        const proxy = getCurrentInstance();
        return {
          proxy,
          params,
        };
      },
      data() {
        let data: any = {};
        return {
          type: "ms",
          msStyle: "",
          leftStyle: "",
          rightStyle: "",
          data: data,
        };
      },
      created() { },
      methods: {
        init() {
          this.setStyle();
          this.changeData();
        },
        changeData() {
          this.data = DoublePY.getValue(this.params.doublePY.type).data;
        },

        setStyle() {
          this.msStyle = `
              left: ${this.params.doublePY.x}%;
              top: ${100 - this.params.doublePY.y}%;
              `;
          this.leftStyle = `color:${this.params.doublePY.leftStyle}`;
          this.rightStyle = `color:${this.params.doublePY.rightStyle}`;
        },
      },
      components: {},
    });
    return vue;
  }
}

export default Component;
