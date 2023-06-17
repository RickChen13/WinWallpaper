/**
 * vue.config.js
 * @description 配置文件
 * 
 * @see https://cli.vuejs.org/zh/config/index.html#vue-config-js
 */
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ?
    "./" : "./",
  outputDir: "./we-web"
};
