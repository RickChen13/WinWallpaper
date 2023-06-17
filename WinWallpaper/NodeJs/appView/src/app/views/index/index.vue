<template>
  <div class="main">
    <!-- apps  -->
    <div class="left" id="left">
      <Apps />
    </div>

    <!-- appSetting -->
    <div class="right">
      <AppSetting />
    </div>
  </div>
  <WebViewCallback />
</template>

<script lang="ts">
import Component from "@/app/views/index/index";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/views/index/index.scss";
</style>