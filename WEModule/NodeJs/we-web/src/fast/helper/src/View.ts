import path from "path";
import Write from "./Write";

const BASE_PATH = path.join(__dirname, "../../../..");
const BASE_APP_PATH = path.join(BASE_PATH, "/src/app");
const APP_PATH = "";

class View {
  /**
   * 快速生成页面与组件
   *
   * @param name 名称
   * @param type 类型:1=页面,2=组件
   * @param append 路径后缀
   */
  static quick(name: string, type: 1 | 2 = 1, append = "/") {
    if (name == "") {
      console.log("文件名称不能为空~");
      return;
    }
    let typeName = "/views";
    switch (type) {
      case 1:
        typeName = "/views";
        break;
      case 2:
        typeName = "/components";
        break;
      default:
        break;
    }
    View.vue(name, typeName, append);
    View.scss(name, typeName, append);
    View.bll(name, typeName, append);
  }

  /**
   * 添加vue文件
   *
   * @param name
   * @param typeName
   * @param append
   */
  static vue(name: string, typeName = "/views", append = "/") {
    if (name == "") {
      console.error("文件名称不能为空~");
      return;
    }
    let Fullmc = `${name}.vue`;
    append = Write.formatFrist(append);
    append = Write.formatLast(append);
    let dir = BASE_APP_PATH + APP_PATH + `${typeName}${append}`;
    let content = `
<template>
    <div>
        ${name}
    </div>
</template>

<script lang="ts">
import Component from "@/app${typeName}${append}${name}"
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app${typeName}${append}${name}.scss";
</style>
`;

    Write.put(dir, Fullmc, content);
  }

  /**
   * 添加scss文件
   *
   * @param name
   * @param typeName
   * @param append
   */
  static scss(name: string, typeName = "/views", append = "/") {
    if (name == "") {
      console.error("文件名称不能为空~");
      return;
    }
    let Fullmc = `${name}.scss`;
    append = Write.formatFrist(append);
    append = Write.formatLast(append);
    let dir = BASE_APP_PATH + APP_PATH + `${typeName}${append}`;
    let content = ``;
    Write.put(dir, Fullmc, content);
  }

  /**
   * 添加bll层
   *
   * @param name
   * @param typeName
   * @param append
   */
  static bll(name: string, typeName = "/views", append = "/") {
    if (name == "") {
      console.error("文件名称不能为空~");
      return;
    }
    let Fullmc = `${name}.ts`;
    append = Write.formatFrist(append);
    append = Write.formatLast(append);
    let dir = BASE_APP_PATH + APP_PATH + `${typeName}${append}`;
    let content = `
import BaseViews from "@/fast/base/BaseView";
import { defineComponent, getCurrentInstance } from "vue";

class Component extends BaseViews {
    constructor() {
    super();
    }

    public vue() {
    const vue = defineComponent({
        setup() {
        return {};
        },
        created() {},
        methods: {},
        components: {},
    });
    return vue;
    }
}

export default Component;
`;

    Write.put(dir, Fullmc, content);
  }
}

export default View;
