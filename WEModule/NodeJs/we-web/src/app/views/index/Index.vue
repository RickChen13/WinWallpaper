<template>
  <AudioCanvas ref="audioCanvas" />
  <Background ref="background" />
  <Date ref="date" />
  <Weather ref="weather" />
  <DoublePY ref="doublePY" />
  <Monitor ref="monitor" />
  <NetWorkSeppkMonitor ref="netWorkSeppkMonitor" />
  <MusicPlayer ref="musicPlayer" />
</template>

<script lang="ts">
import Component from "@/app/views/index/Index";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/views/index/Index.scss";
</style>