<template>
  <div class="modules" id="date">
    <div :class="myClass" :style="timeStyle">
      <div v-html="His"></div>
    </div>
    <div :class="myClass" :style="dateStyle">
      <span v-html="date"></span>
    </div>
    <div :class="myClass" :style="gzDateStyle">
      <span v-html="gzDate"></span>
    </div>
    <div :class="myClass" :style="lunarStyle">
      <span v-html="lunar"></span>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "./Date";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@use "./Date.scss";
</style>