<template>
  <div
    class="modules"
    id="netWorkSeppkMonitor"
    v-show="params.netWorkSpeekMonitor.show"
  >
    <div :class="myClass" :style="style">
      <span>
        {{ networkInterfaceName }}&nbsp;&nbsp; {{ sed }}&nbsp;&nbsp; {{ rec }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "@/app/components/netWorkSeppkMonitor/NetWorkSeppkMonitor";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/components/netWorkSeppkMonitor/NetWorkSeppkMonitor.scss";
</style>