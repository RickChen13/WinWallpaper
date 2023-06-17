<template>
  <div class="modules" id="weather">
    <div :class="myClass" :style="weatherStyle">
      <span v-html="weather"></span>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "@/app/components/weather/weather";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/components/weather/weather.scss";
</style>