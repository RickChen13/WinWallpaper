<template>
  <div class="modules" v-show="params.monitro.show" id="monitro">
    <div :class="myClass" :style="style">
      <template v-for="(item, index) in cpu" :key="index">
        <div class="line">
          <span v-text="item.Name"></span>&nbsp;&nbsp; 使用率：<span v-text="Math.round(item.Use)"></span>%&nbsp;&nbsp;
          温度：<span v-text="Math.round(item.Temperature)"></span>℃&nbsp;&nbsp; 功率：<span
            v-text="Math.round(item.Power)"></span>W&nbsp;&nbsp;
        </div>
      </template>
      <template v-for="(item, index) in gpu" :key="index">
        <div class="line">
          <span v-text="item.Name"></span>&nbsp;&nbsp; 使用率：<span v-text="Math.round(item.Value)"></span>%
        </div>
      </template>
      <template v-for="(item, index) in ram" :key="index">
        <div class="line">
          <span v-text="item.Name"></span>&nbsp;&nbsp; 内存使用率：<span v-text="Math.round(item.Value)"></span>% &nbsp;
        </div>
      </template>
      <template v-for="(item, index) in hdd" :key="index">
        <div class="line">
          <span v-text="item.Name"></span>&nbsp;&nbsp; 磁盘<span v-text="index"></span>
          已使用：<span v-text="Math.round(item.Value)"></span>%
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "./Monitro";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@use "./Monitro.scss";
</style>