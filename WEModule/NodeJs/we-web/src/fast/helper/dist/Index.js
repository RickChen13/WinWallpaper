"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/View.ts
var import_path2 = __toESM(require("path"));

// src/Write.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var isAbsolute = function(filePath) {
  filePath = import_path.default.normalize(filePath);
  if (filePath.substring(0, 1) == "/")
    return true;
  if (filePath.search(/[\w]+:/) == 0)
    return true;
  return false;
};
var mkdirSync = function(dirPath) {
  if (dirPath == null || dirPath == "")
    return;
  dirPath = isAbsolute(dirPath) ? import_path.default.normalize(dirPath) : import_path.default.join(process.cwd(), dirPath);
  if (import_fs.default.existsSync(dirPath))
    return;
  var arr = dirPath.split(import_path.default.sep);
  var index = arr.length - 1;
  var tempStr = arr[index];
  while (tempStr == "" && arr.length > 0) {
    index--;
    tempStr = arr[index];
  }
  if (tempStr == "")
    return;
  var newPath = dirPath.substring(0, dirPath.length - tempStr.length - 1);
  if (!import_fs.default.existsSync(newPath))
    mkdirSync(newPath);
  import_fs.default.mkdirSync(dirPath);
};
var Write = class {
  /**
   * 文件写入
   *
   * @param string dir 目录
   * @param string Fullmc 文件名称
   * @param string content 内容
   * @return void
   */
  static put(dir, Fullmc, content) {
    Write.formatLast(dir, false);
    dir = import_path.default.join(dir);
    if (!import_fs.default.existsSync(dir)) {
      mkdirSync(dir);
    }
    let filename = dir + Fullmc;
    try {
      import_fs.default.accessSync(filename, import_fs.constants.R_OK | import_fs.constants.W_OK);
      console.log("\u6587\u4EF6\uFF1A" + filename + "\u5DF2\u7ECF\u5B58\u5728");
      return;
    } catch (e) {
    }
    import_fs.default.writeFile(filename, content, (err) => {
      if (err) {
        return console.log(`\u6587\u4EF6${filename}\u5199\u5165\u5931\u8D25`);
      }
      console.log(`${filename}\u521B\u5EFA\u6210\u529F`);
    });
  }
  static formatFrist(str, append = true) {
    let frist = str.substring(0, 1);
    if (append) {
      if (frist != "/") {
        str = "/" + str;
      }
    } else {
      if (frist == "/") {
        str = str.substring(1, str.length - 1);
      }
    }
    return str;
  }
  static formatLast(str, append = true) {
    let last = str.substring(str.length - 1);
    if (append) {
      if (last != "/") {
        str = str + "/";
      }
    } else {
      if (last == "/") {
        str = str.substring(0, str.length);
      }
    }
    return str;
  }
};

// src/View.ts
var BASE_PATH = import_path2.default.join(__dirname, "../../../..");
var BASE_APP_PATH = import_path2.default.join(BASE_PATH, "/src/app");
var APP_PATH = "";
var View = class {
  /**
   * 快速生成页面与组件
   *
   * @param name 名称
   * @param type 类型:1=页面,2=组件
   * @param append 路径后缀
   */
  static quick(name, type = 1, append = "/") {
    if (name == "") {
      console.log("\u6587\u4EF6\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A~");
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
  static vue(name, typeName = "/views", append = "/") {
    if (name == "") {
      console.error("\u6587\u4EF6\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A~");
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
  static scss(name, typeName = "/views", append = "/") {
    if (name == "") {
      console.error("\u6587\u4EF6\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A~");
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
  static bll(name, typeName = "/views", append = "/") {
    if (name == "") {
      console.error("\u6587\u4EF6\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A~");
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
};
var View_default = View;

// src/Params.ts
var import_process = require("process");
var _Params = class {
  static haveHelp() {
    for (let index = 0; index < import_process.argv.length; index++) {
      const element = import_process.argv[index];
      if (element == "-h" || element == "--help") {
        return true;
      }
    }
    return false;
  }
};
var Params = _Params;
//-
Params.param = (name, Default = null) => {
  for (let index = 0; index < import_process.argv.length; index++) {
    const element = import_process.argv[index];
    if (element == `-${name}`) {
      if (index + 1 < import_process.argv.length) {
        return import_process.argv[index + 1];
      }
      return Default;
    }
  }
  return Default;
};
//--
Params.option = (name, Default = null) => {
  for (let index = 0; index < import_process.argv.length; index++) {
    const element = import_process.argv[index];
    if (element == `--${name}`) {
      if (index + 1 < import_process.argv.length) {
        return import_process.argv[index + 1];
      }
      return Default;
    }
  }
  return Default;
};
Params.GetArgv = () => {
  let name = _Params.param("n");
  let type = _Params.param("t");
  let append = _Params.param("a");
  if (!name) {
    name = _Params.option("name");
  }
  if (!type) {
    type = _Params.option("type");
  }
  if (!append) {
    append = _Params.option("append");
  }
  return {
    name,
    type,
    append
  };
};
var Params_default = Params;

// src/Index.ts
var cl = console.log;
var help = () => {
  cl();
  cl(`\u5FEB\u901F\u751F\u6210\u9875\u9762\u4E0E\u7EC4\u4EF6`);
  cl("-n  --n      \u540D\u79F0");
  cl("-t  --t      \u7C7B\u578B:1=\u9875\u9762,2=\u7EC4\u4EF6");
  cl("-a  --append \u540D\u79F0");
  cl("\u4F8B\u5B50");
  cl("yarn helper -t 2 -n  Index -a /index");
  cl();
};
if (Params_default.haveHelp()) {
  help();
} else {
  const params = Params_default.GetArgv();
  if (!params.name || !params.type || !params.append) {
    cl("\u53C2\u6570\u4E0D\u5B8C\u6574~");
    help();
  } else {
    let Type = Number(params.type);
    if (Type == 1 || Type == 2) {
      View_default.quick(params.name, Type, params.append);
    } else {
      cl("\u53C2\u6570type\u4E0D\u6B63\u786E~");
      help();
    }
  }
}
//# sourceMappingURL=Index.js.map