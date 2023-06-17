<template>
  <div
    class="modules"
    v-show="params.netWorkSpeekMonitor.show"
    id="netWorkSeppkMonitor"
  >
    <div :class="myClass" :style="style">
      <span>
        网络类型：{{ networkInterfaceName }}&nbsp;&nbsp; 上行：{{
          sed
        }}&nbsp;&nbsp; 下行：{{ rec }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "@/app/components/netWorkSeppkMonitor/netWorkSeppkMonitor";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/components/netWorkSeppkMonitor/netWorkSeppkMonitor.scss";
</style>